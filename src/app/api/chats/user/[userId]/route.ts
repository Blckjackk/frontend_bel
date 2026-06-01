import { NextRequest, NextResponse } from 'next/server';
import { chats, messages } from '@/src/lib/chat.store';

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const userType = req.nextUrl.searchParams.get('userType') || 'customer';
  const userChats = [];

  for (const [chatId, chat] of chats) {
    let isUserInChat = false;

    if (userType === 'customer' && chat.customerId === userId) isUserInChat = true;
    else if (userType === 'provider' && chat.officeProviderId === userId) isUserInChat = true;
    else if (userType === 'admin') isUserInChat = true;

    if (isUserInChat) {
      const chatMessages = messages.get(chatId) || [];
      const unreadCount = chatMessages.filter((m) => !m.isRead).length;
      userChats.push({ ...chat, messages: chatMessages.slice(-20), unreadCount });
    }
  }

  userChats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return NextResponse.json(userChats);
}
