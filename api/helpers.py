import os
from dotenv import load_dotenv
from supabase import create_client, Client
from openai import OpenAI
import numpy as np

load_dotenv()

def get_supabase_client() -> Client:
    """Initializes and returns a Supabase client with validation."""
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        raise ValueError("SUPABASE_URL or SUPABASE_KEY missing from environment")
    return create_client(url, key)

def get_openai_client():
    """Initializes and returns an OpenAI client with validation."""
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY missing from environment")
    return OpenAI(api_key=api_key)

def get_embedding(text: str, model="text-embedding-ada-002"):
    """Generates an embedding for a given text using OpenAI."""
    client = get_openai_client()
    response = client.embeddings.create(input=[text], model=model)
    return response.data[0].embedding

async def store_memory(user_id: str, domain: str, content: str, tags: list = []):
    """Stores a memory in the specified domain and the global memory table."""
    supabase = get_supabase_client()
    embedding = get_embedding(content)
    
    # Store in domain-specific table
    domain_table = f"{domain}_memories"
    domain_memory_data = {"user_id": user_id, "content": content, "embedding": embedding, "tags": tags}
    supabase.table(domain_table).insert(domain_memory_data).execute()

    # Store in global table
    global_memory_data = {"user_id": user_id, "domain": domain, "content": content, "embedding": embedding, "tags": tags}
    supabase.table("global_memories").insert(global_memory_data).execute()
    
    return {"message": "Memory stored successfully"}

async def fetch_global_memories(user_id: str, query: str, match_threshold: float = 0.5, match_count: int = 5):
    """Fetches relevant memories from all domains using a query."""
    supabase = get_supabase_client()
    embedding = get_embedding(query)
    
    # RPC call to the match_global_memories function in Supabase
    result = supabase.rpc(
        "match_global_memories",
        {
            "p_user_id": user_id,
            "query_embedding": embedding,
            "match_threshold": match_threshold,
            "match_count": match_count
        }
    ).execute()
    
    return result.data
