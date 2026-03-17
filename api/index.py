import os
import json
import traceback
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from openai import OpenAI

# Load environment variables
load_dotenv()

app = FastAPI(root_path="/api")

# Global CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Diagnostic Middleware ---
@app.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        # Return the actual Python error to the browser for debugging
        error_trace = traceback.format_exc()
        return JSONResponse(
            status_code=500,
            content={
                "error": str(e),
                "traceback": error_trace,
                "path": request.url.path
            }
        )

# --- Models ---
class MemoryInput(BaseModel):
    user_id: str
    content: str
    tags: Optional[List[str]] = []

class ChatInput(BaseModel):
    user_id: str
    query: str

# --- Core Logic ---
def get_clients():
    s_url = os.environ.get("SUPABASE_URL")
    s_key = os.environ.get("SUPABASE_KEY")
    o_key = os.environ.get("OPENAI_API_KEY")
    
    if not all([s_url, s_key, o_key]):
        raise HTTPException(status_code=500, detail="Environment variables missing")
    
    return create_client(s_url, s_key), OpenAI(api_key=o_key)

# --- Endpoints ---
@app.get("/health")
def health():
    return {"status": "Aura Core Operational", "keys_set": bool(os.environ.get("OPENAI_API_KEY"))}

@app.get("/ping")
def ping():
    return {"status": "pong"}

@app.post("/memory/{domain}")
async def save_memory(domain: str, memory: MemoryInput):
    supabase, openai = get_clients()
    
    # Generate embedding
    emb_res = openai.embeddings.create(input=[memory.content], model="text-embedding-ada-002")
    embedding = emb_res.data[0].embedding
    
    # Insert domain
    supabase.table(f"{domain}_memories").insert({
        "user_id": memory.user_id,
        "content": memory.content,
        "embedding": embedding,
        "tags": memory.tags
    }).execute()

    # Insert global
    supabase.table("global_memories").insert({
        "user_id": memory.user_id,
        "domain": domain,
        "content": memory.content,
        "embedding": embedding,
        "tags": memory.tags
    }).execute()
    
    return {"status": "success"}

@app.post("/chat")
async def chat(chat_input: ChatInput):
    supabase, openai = get_clients()
    
    # Generate query embedding
    emb_res = openai.embeddings.create(input=[chat_input.query], model="text-embedding-ada-002")
    embedding = emb_res.data[0].embedding
    
    # RPC Match
    rpc_res = supabase.rpc("match_global_memories", {
        "p_user_id": chat_input.user_id,
        "query_embedding": embedding,
        "match_threshold": 0.5,
        "match_count": 5
    }).execute()
    
    memories = rpc_res.data or []
    context = "\n".join([f"[{m.get('domain', 'general')}]: {m.get('content', '')}" for m in memories])
    
    chat_res = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": f"You are AURA. Context:\n{context}"},
            {"role": "user", "content": chat_input.query}
        ],
        max_tokens=400
    )
    
    return {"response": chat_res.choices[0].message.content}
