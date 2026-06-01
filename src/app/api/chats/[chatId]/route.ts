import { NextRequest, NextResponse } from 'next/server';
import { chats, messages } from '@/src/lib/chat.store';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params;
  const chat = chats.get(chatId);

  if (!chat) {
    return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
  }

  const chatMessages = messages.get(chatId) || [];
  const unreadCount = chatMessages.filter((m) => !m.isRead).length;

  return NextResponse.json({ ...chat, messages: chatMessages, unreadCount });
}
