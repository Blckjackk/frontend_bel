const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = {
  post: async (endpoint: string, body: any) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  get: async (endpoint: string, token?: string) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.json();
  },
};