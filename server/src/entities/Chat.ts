export interface Chat {
  id: string;
  customerId: string;
  officeId: number;
  officeProviderId: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderType: 'customer' | 'provider' | 'admin';
  senderName: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
}
