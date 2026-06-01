export interface CreateChatDto {
  customerId: string;
  officeId: number;
  officeProviderId: string;
}

export interface SendMessageDto {
  chatId: string;
  message: string;
}

export interface ChatMessageResponseDto {
  id: string;
  chatId: string;
  senderId: string;
  senderType: 'customer' | 'provider' | 'admin';
  senderName: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
}

export interface ChatResponseDto {
  id: string;
  customerId: string;
  officeId: number;
  officeProviderId: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  messages: ChatMessageResponseDto[];
  unreadCount: number;
}
