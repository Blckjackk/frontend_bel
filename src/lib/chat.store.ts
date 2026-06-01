// In-memory store (data hilang saat server restart - ok untuk development)
export const chats: Map<string, any> = new Map();
export const messages: Map<string, any[]> = new Map();