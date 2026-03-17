
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from openai import OpenAI
import numpy as np

load_dotenv()

# Supabase setup
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
#This is a placeholder for a JWT secret, but is not used in this implementation
JWT_SECRET = os.environ.get("JWT_SECRET")

# OpenAI setup
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

def get_supabase_client() -> Client:
    """Initializes and returns a Supabase client."""
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def get_openai_client():
    """Initializes and returns an OpenAI client."""
    return OpenAI(api_key=OPENAI_API_KEY)

def get_embedding(text: str, model="text-embedding-ada-002"):
    """Generates an embedding for a given text using OpenAI."""
    openai_client = get_openai_client()
    response = openai_client.embeddings.create(input=[text], model=model)
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

async def fetch_memories(user_id: str, domain: str, query: str, match_threshold: float = 0.5, match_count: int = 5):
    """Fetches relevant memories from a specific domain using a query."""
    supabase = get_supabase_client()
    embedding = get_embedding(query)
    
    # RPC call to the match_memories function in Supabase
    result = supabase.rpc(
        "match_memories",
        {
            "p_user_id": user_id,
            "p_domain": domain,
            "query_embedding": embedding,
            "match_threshold": match_threshold,
            "match_count": match_count
        }
    ).execute()
    
    return result.data

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
