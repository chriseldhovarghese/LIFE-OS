
// In Vercel, the API is served from the same origin under /api
const isDevelopment = import.meta.env.MODE === 'development';
export const API_URL = isDevelopment 
  ? "http://localhost:8000/api" 
  : "/api";

export const API_ENDPOINTS = {
  CHAT: `${API_URL}/chat`,
  MEMORY: (domain: string) => `${API_URL}/memory/${domain}`,
  MEMORY_LIST: (domain: string, userId: string) => `${API_URL}/memory/${domain}/${userId}`,
  CORRECT: `${API_URL}/correct`,
  PING: `${API_URL}/ping`,
};
