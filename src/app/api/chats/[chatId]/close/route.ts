import { NextRequest, NextResponse } from 'next/server';
import { chats } from '@/src/lib/chat.store';

export async function PUT(_req: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params;
  const chat = chats.get(chatId);

  if (!chat) {
    return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
  }

  chat.isActive = false;
  chat.updatedAt = new Date().toISOString();

  return NextResponse.json(chat);
}
