import os
import json
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
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
    """Lazy init clients with explicit error handling."""
    s_url = os.environ.get("SUPABASE_URL")
    s_key = os.environ.get("SUPABASE_KEY")
    o_key = os.environ.get("OPENAI_API_KEY")
    
    if not all([s_url, s_key, o_key]):
        missing = [k for k, v in {"SUPABASE_URL":s_url, "SUPABASE_KEY":s_key, "OPENAI_API_KEY":o_key}.items() if not v]
        raise HTTPException(status_code=500, detail=f"Missing Keys: {', '.join(missing)}")
    
    return create_client(s_url, s_key), OpenAI(api_key=o_key)

def generate_embedding(client: OpenAI, text: str):
    """Generate embedding using OpenAI."""
    try:
        response = client.embeddings.create(input=[text], model="text-embedding-ada-002")
        return response.data[0].embedding
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI Embedding Error: {str(e)}")

# --- Endpoints ---
@app.get("/health")
def health():
    return {"status": "Aura Core Operational", "keys_set": bool(os.environ.get("OPENAI_API_KEY"))}

@app.post("/memory/{domain}")
async def save_memory(domain: str, memory: MemoryInput):
    try:
        supabase, openai = get_clients()
        embedding = generate_embedding(openai, memory.content)
        
        # Insert into domain-specific table
        res_domain = supabase.table(f"{domain}_memories").insert({
            "user_id": memory.user_id,
            "content": memory.content,
            "embedding": embedding,
            "tags": memory.tags
        }).execute()

        # Insert into global table
        res_global = supabase.table("global_memories").insert({
            "user_id": memory.user_id,
            "domain": domain,
            "content": memory.content,
            "embedding": embedding,
            "tags": memory.tags
        }).execute()
        
        return {"status": "success", "message": f"Memory committed to {domain}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Aura Memory Error: {str(e)}")

@app.post("/chat")
async def chat(chat_input: ChatInput):
    try:
        supabase, openai = get_clients()
        embedding = generate_embedding(openai, chat_input.query)
        
        # Match global memories using Supabase RPC
        rpc_res = supabase.rpc("match_global_memories", {
            "p_user_id": chat_input.user_id,
            "query_embedding": embedding,
            "match_threshold": 0.5,
            "match_count": 5
        }).execute()
        
        memories = rpc_res.data or []
        context = "\n".join([f"[{m.get('domain', 'general')}]: {m.get('content', '')}" for m in memories])
        
        system_prompt = f"You are AURA, an intelligent LifeOS. Context from user history:\n{context}\nAnswer based on this context if relevant."
        
        chat_res = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": chat_input.query}
            ],
            max_tokens=400
        )
        
        return {
            "response": chat_res.choices[0].message.content,
            "context_count": len(memories)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Aura Chat Error: {str(e)}")
