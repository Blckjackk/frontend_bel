import { NextRequest, NextResponse } from 'next/server';
import { chats, messages } from '@/src/lib/chat.store';

export async function POST(req: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params;
  const chatMessages = messages.get(chatId);

  if (!chatMessages) {
    return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
  }

  const body = await req.json();
  const chat = chats.get(chatId);

  if (chat && !chat.isActive) {
    return NextResponse.json({ message: 'Chat is closed' }, { status: 403 });
  }

  const newMessage = {
    id: `msg_${Date.now()}`,
    chatId,
    senderId: body.senderId || 'unknown',
    senderType: body.senderType || 'customer',
    senderName: body.senderName || 'Unknown',
    message: body.message,
    createdAt: new Date().toISOString(),
    isRead: false,
  };

  chatMessages.push(newMessage);

  if (chat) {
    chat.updatedAt = new Date().toISOString();
  }

  return NextResponse.json(newMessage, { status: 201 });
}
