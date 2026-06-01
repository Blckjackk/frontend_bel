import {
  ChatRoom,
  CreateChatPayload,
  SendMessagePayload,
} from '../types/chat.types';

export const chatApi = {
  createChat: async (payload: CreateChatPayload): Promise<ChatRoom> => {
    const res = await fetch('/api/chats/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Gagal membuat chat');
    return res.json();
  },

  getChat: async (chatId: string): Promise<ChatRoom> => {
    const res = await fetch(`/api/chats/${chatId}`);
    if (!res.ok) throw new Error('Chat tidak ditemukan');
    return res.json();
  },

  getUserChats: async (userId: string, userType: 'customer' | 'provider' | 'admin'): Promise<ChatRoom[]> => {
    const res = await fetch(`/api/chats/user/${userId}?userType=${userType}`);
    if (!res.ok) throw new Error('Gagal memuat chat');
    return res.json();
  },

  getAllChats: async (): Promise<ChatRoom[]> => {
    const res = await fetch('/api/chats/admin/all-chats');
    if (!res.ok) throw new Error('Gagal memuat semua chat');
    return res.json();
  },

  sendMessage: async (chatId: string, payload: SendMessagePayload) => {
    const res = await fetch(`/api/chats/${chatId}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Gagal mengirim pesan');
    return res.json();
  },

  closeChat: async (chatId: string): Promise<ChatRoom> => {
    const res = await fetch(`/api/chats/${chatId}/close`, { method: 'PUT' });
    if (!res.ok) throw new Error('Gagal menutup chat');
    return res.json();
  },
};
