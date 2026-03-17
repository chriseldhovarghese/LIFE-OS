
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from .env file
load_dotenv()

# --- Environment Variable Validation ---
required_env_vars = ["SUPABASE_URL", "SUPABASE_KEY", "OPENAI_API_KEY"]
missing_vars = [var for var in required_env_vars if os.environ.get(var) is None]

if missing_vars:
    raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")
# -------------------------------------

from .helpers import (
    store_memory,
    fetch_memories,
    fetch_global_memories,
    get_openai_client,
    get_supabase_client,
)

app = FastAPI(
    title="Long-Term Memory API",
    description="API for storing and retrieving user memories",
    version="1.0.0",
    root_path="/api",
)

# Define the origins that should be allowed to make cross-origin requests.
origins = [
    "http://localhost:8080",
    "http://localhost:5173",
    "https://lifeos-ai.vercel.app", # Replace with your actual domain
]

# Allow all origins in production for flexibility (or specify more strictly)
if os.environ.get("VERCEL_ENV"):
    origins.append("*")

# Add the CORS middleware to the FastAPI application.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if os.environ.get("VERCEL_ENV") else origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request bodies
class MemoryInput(BaseModel):
    user_id: str
    content: str
    tags: Optional[List[str]] = []

class ChatInput(BaseModel):
    user_id: str
    query: str

class CorrectionInput(BaseModel):
    memory_id: str
    corrected_content: str
    domain: str

# API Endpoints
@app.get("/ping")
def ping():
    """Health check endpoint."""
    return {"status": "ok"}

@app.post("/memory/{domain}")
async def save_memory_endpoint(domain: str, memory: MemoryInput):
    """Saves a memory to the specified domain."""
    await store_memory(memory.user_id, domain, memory.content, memory.tags)
    return {"message": f"Memory stored in {domain}"}

@app.get("/memory/{domain}/{user_id}")
async def list_memories_endpoint(domain: str, user_id: str):
    """Lists all memories for a user in a specific domain."""
    supabase = get_supabase_client()
    table_name = f"{domain}_memories"
    result = supabase.table(table_name).select("*").eq("user_id", user_id).execute()
    return result.data

@app.post("/chat")
async def chat_endpoint(chat_input: ChatInput):
    """Handles chat interactions by retrieving relevant memories and generating a response."""
    try:
        memories = await fetch_global_memories(chat_input.user_id, chat_input.query)
        context = "\n".join([f"[{m['domain']}]: {m['content']}" for m in memories])
        
        system_prompt = f"""You are LIFEOS AI, a personalized companion.
        Use the following memories about the user to answer their query.
        If no memories are provided, answer politely based on general knowledge.
        
        Context Memories:\n{context}"""
        
        openai_client = get_openai_client()
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": chat_input.query}
            ],
            max_tokens=300,
        )
        
        return {
            "response": response.choices[0].message.content.strip(),
            "memories": memories
        }
    except Exception as e:
        print(f"Error in chat_endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/correct")
async def correct_memory_endpoint(correction: CorrectionInput):
    """Corrects a memory and its embedding."""
    supabase = get_supabase_client()
    table_name = f"{correction.domain}_memories"
    
    supabase.table(table_name).update({"content": correction.corrected_content}).eq("id", correction.memory_id).execute()
    
    return {"message": "Memory corrected successfully"}
