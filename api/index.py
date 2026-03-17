import os
import traceback
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional

# Load environment variables
load_dotenv()

app = FastAPI()

# --- Models ---
class ChatInput(BaseModel):
    user_id: str
    query: str

class MemoryInput(BaseModel):
    user_id: str
    content: str
    tags: Optional[List[str]] = []

# --- Simple Endpoints for Verification ---
@app.get("/api/ping")
def ping():
    return {"status": "pong", "env": os.environ.get("VERCEL_ENV", "local")}

@app.get("/api/health")
def health():
    return {
        "status": "Aura Core Operational",
        "has_openai": bool(os.environ.get("OPENAI_API_KEY")),
        "has_supabase": bool(os.environ.get("SUPABASE_URL"))
    }

# --- Main Handlers ---
@app.post("/api/chat")
async def chat(chat_input: ChatInput):
    try:
        from supabase import create_client
        from openai import OpenAI
        
        s_url = os.environ.get("SUPABASE_URL")
        s_key = os.environ.get("SUPABASE_KEY")
        o_key = os.environ.get("OPENAI_API_KEY")
        
        if not all([s_url, s_key, o_key]):
            return JSONResponse(status_code=500, content={"error": "Missing API Keys in Vercel settings"})

        supabase = create_client(s_url, s_key)
        openai = OpenAI(api_key=o_key)

        # 1. Embedding
        emb_res = openai.embeddings.create(input=[chat_input.query], model="text-embedding-ada-002")
        embedding = emb_res.data[0].embedding

        # 2. RAG Match
        rpc_res = supabase.rpc("match_global_memories", {
            "p_user_id": chat_input.user_id,
            "query_embedding": embedding,
            "match_threshold": 0.5,
            "match_count": 5
        }).execute()
        
        memories = rpc_res.data or []
        context = "\n".join([f"[{m.get('domain', 'general')}]: {m.get('content', '')}" for m in memories])
        
        # 3. Completion
        chat_res = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": f"You are AURA. Context:\n{context}"},
                {"role": "user", "content": chat_input.query}
            ],
            max_tokens=400
        )
        
        return {"response": chat_res.choices[0].message.content}
        
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e), "traceback": traceback.format_exc()})

@app.post("/api/memory/{domain}")
async def save_memory(domain: str, memory: MemoryInput):
    try:
        from supabase import create_client
        from openai import OpenAI
        
        supabase = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))
        openai = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        
        emb_res = openai.embeddings.create(input=[memory.content], model="text-embedding-ada-002")
        embedding = emb_res.data[0].embedding
        
        supabase.table(f"{domain}_memories").insert({
            "user_id": memory.user_id,
            "content": memory.content,
            "embedding": embedding,
            "tags": memory.tags
        }).execute()

        supabase.table("global_memories").insert({
            "user_id": memory.user_id,
            "domain": domain,
            "content": memory.content,
            "embedding": embedding,
            "tags": memory.tags
        }).execute()
        
        return {"status": "success"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e), "traceback": traceback.format_exc()})
