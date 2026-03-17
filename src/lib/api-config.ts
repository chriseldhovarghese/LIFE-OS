
export const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? `${window.location.origin}/api` : "http://localhost:8000/api");

export const API_ENDPOINTS = {
  CHAT: `${API_URL}/chat`,
  MEMORY: (domain: string) => `${API_URL}/memory/${domain}`,
  MEMORY_LIST: (domain: string, userId: string) => `${API_URL}/memory/${domain}/${userId}`,
  CORRECT: `${API_URL}/correct`,
  PING: `${API_URL}/ping`,
};
