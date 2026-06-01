import { NextResponse } from 'next/server';
import { chats, messages } from '@/src/lib/chat.store';

export async function GET() {
  const allChats = [];

  for (const [chatId, chat] of chats) {
    const chatMessages = messages.get(chatId) || [];
    const unreadCount = chatMessages.filter((m) => !m.isRead).length;
    allChats.push({ ...chat, messages: chatMessages, unreadCount });
  }

  allChats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return NextResponse.json(allChats);
}
