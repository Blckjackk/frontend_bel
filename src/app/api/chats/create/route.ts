import { NextRequest, NextResponse } from 'next/server';
import { chats, messages } from '@/src/lib/chat.store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerId, customerName, officeId, officeTitle, officeProviderId } = body;

    if (!customerId || !officeId || !officeProviderId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    for (const [, chat] of chats) {
      if (
        chat.customerId === String(customerId) &&
        chat.officeId === Number(officeId) &&
        chat.officeProviderId === String(officeProviderId) &&
        chat.isActive
      ) {
        const chatMessages = messages.get(chat.id) || [];
        return NextResponse.json({ ...chat, messages: chatMessages, unreadCount: 0 });
      }
    }

    const chatId = `chat_${Date.now()}`;
    const newChat = {
      id: chatId,
      customerId: String(customerId),
      customerName: customerName || `Customer #${String(customerId).slice(-4)}`,
      officeId: Number(officeId),
      officeTitle: officeTitle || `Office #${officeId}`,
      officeProviderId: String(officeProviderId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    };

    chats.set(chatId, newChat);
    messages.set(chatId, []);

    return NextResponse.json({ ...newChat, messages: [], unreadCount: 0 }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
