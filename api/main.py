import os
import traceback
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from supabase import create_client
from openai import OpenAI

load_dotenv()

app = FastAPI()

class ChatInput(BaseModel):
    user_id: str
    query: str

class MemoryInput(BaseModel):
    user_id: str
    content: str
    tags: Optional[List[str]] = []

def get_clients():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    o_key = os.environ.get("OPENAI_API_KEY")
    
    if not all([url, key, o_key]):
        raise ValueError("Missing environment variables")
        
    return create_client(url, key), OpenAI(api_key=o_key)

@app.get("/api/health")
async def health():
    o_key = os.environ.get("OPENAI_API_KEY", "")
    return {
        "status": "Operational",
        "key_hint": f"{o_key[:3]}..." if o_key else "None",
        "env": "pdx1"
    }

@app.get("/api/ping")
async def ping():
    return {"status": "pong"}

@app.post("/api/chat")
async def chat(input_data: ChatInput):
    try:
        supabase, openai = get_clients()
        emb = openai.embeddings.create(input=[input_data.query], model="text-embedding-ada-002")
        vector = emb.data[0].embedding
        rpc = supabase.rpc("match_global_memories", {
            "p_user_id": input_data.user_id,
            "query_embedding": vector,
            "match_threshold": 0.5,
            "match_count": 5
        }).execute()
        memories = rpc.data or []
        context = "\n".join([f"[{m.get('domain', 'general')}]: {m.get('content', '')}" for m in memories])
        res = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": f"You are AURA. Context:\n{context}"},
                {"role": "user", "content": input_data.query}
            ],
            max_tokens=400
        )
        return {"response": res.choices[0].message.content}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e), "trace": traceback.format_exc()})

@app.post("/api/memory/{domain}")
async def memory(domain: str, input_data: MemoryInput):
    try:
        supabase, openai = get_clients()
        emb = openai.embeddings.create(input=[input_data.content], model="text-embedding-ada-002")
        vector = emb.data[0].embedding
        supabase.table(f"{domain}_memories").insert({
            "user_id": input_data.user_id,
            "content": input_data.content,
            "embedding": vector,
            "tags": input_data.tags
        }).execute()
        supabase.table("global_memories").insert({
            "user_id": input_data.user_id,
            "domain": domain,
            "content": input_data.content,
            "embedding": vector,
            "tags": input_data.tags
        }).execute()
        return {"status": "success"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
