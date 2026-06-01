export type ChatSenderType = 'customer' | 'provider' | 'admin';

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderType: ChatSenderType;
  senderName: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface ChatRoom {
  id: string;
  customerId: string;
  customerName?: string;
  officeId: number;
  officeTitle?: string;
  officeProviderId: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  messages: ChatMessage[];
  unreadCount: number;
}

export interface CreateChatPayload {
  customerId: string;
  customerName?: string;
  officeId: number;
  officeTitle?: string;
  officeProviderId: string;
}

export interface SendMessagePayload {
  message: string;
  senderId: string;
  senderType: ChatSenderType;
  senderName: string;
}

export type ChatPanelMode = 'customer' | 'provider' | 'admin';
