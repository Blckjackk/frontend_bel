import { Controller, Post, Get, Put, Param, Body, Req } from "routing-controllers";
import type { CreateChatDto, SendMessageDto, ChatResponseDto } from "../dtos/Chat.dto";

// In-memory storage untuk demo (gunakan database di production)
const chats: Map<string, any> = new Map();
const messages: Map<string, any[]> = new Map();

@Controller("/chats")
export class ChatController {
  @Post("/create")
  createChat(@Body() body: CreateChatDto) {
    const chatId = `chat_${Date.now()}`;
    const newChat = {
      id: chatId,
      customerId: body.customerId,
      officeId: body.officeId,
      officeProviderId: body.officeProviderId,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };
    
    chats.set(chatId, newChat);
    messages.set(chatId, []);
    
    return newChat;
  }

  @Get("/:chatId")
  getChat(@Param("chatId") chatId: string): ChatResponseDto | null {
    const chat = chats.get(chatId);
    if (!chat) return null;

    const chatMessages = messages.get(chatId) || [];
    const unreadCount = chatMessages.filter((m: any) => !m.isRead).length;

    return {
      ...chat,
      messages: chatMessages,
      unreadCount,
    };
  }

  @Get("/user/:userId")
  getUserChats(@Param("userId") userId: string, @Req() req: any) {
    const userType = req.query?.userType || "customer";
    const userChats: ChatResponseDto[] = [];

    for (const [chatId, chat] of chats) {
      let isUserInChat = false;

      if (userType === "customer" && chat.customerId === userId) {
        isUserInChat = true;
      } else if (userType === "provider" && chat.officeProviderId === userId) {
        isUserInChat = true;
      } else if (userType === "admin") {
        isUserInChat = true;
      }

      if (isUserInChat) {
        const chatMessages = messages.get(chatId) || [];
        const unreadCount = chatMessages.filter((m: any) => !m.isRead).length;

        userChats.push({
          ...chat,
          messages: chatMessages.slice(-10),
          unreadCount,
        });
      }
    }

    return userChats;
  }

  @Post("/:chatId/send")
  sendMessage(
    @Param("chatId") chatId: string,
    @Body() body: SendMessageDto,
    @Req() req: any
  ) {
    const chatMessages = messages.get(chatId);
    if (!chatMessages) {
      return { error: "Chat not found" };
    }

    const senderId = req.user?.id || "unknown";
    const senderType = req.user?.type || "customer";
    const senderName = req.user?.name || "Unknown";

    const newMessage = {
      id: `msg_${Date.now()}`,
      chatId,
      senderId,
      senderType,
      senderName,
      message: body.message,
      createdAt: new Date(),
      isRead: false,
    };

    chatMessages.push(newMessage);
    
    const chat = chats.get(chatId);
    if (chat) {
      chat.updatedAt = new Date();
    }

    return newMessage;
  }

  @Put("/:chatId/mark-read")
  markAsRead(@Param("chatId") chatId: string, @Req() req: any) {
    const chatMessages = messages.get(chatId);
    if (!chatMessages) return;

    const userId = req.user?.id;
    chatMessages.forEach((msg: any) => {
      if (msg.senderId !== userId && !msg.isRead) {
        msg.isRead = true;
      }
    });

    return { success: true };
  }

  @Get("/admin/all-chats")
  getAllChats() {
    const allChats: ChatResponseDto[] = [];

    for (const [chatId, chat] of chats) {
      const chatMessages = messages.get(chatId) || [];
      const unreadCount = chatMessages.filter((m: any) => !m.isRead).length;

      allChats.push({
        ...chat,
        messages: chatMessages.slice(-5),
        unreadCount,
      });
    }

    return allChats;
  }

  @Put("/:chatId/close")
  closeChat(@Param("chatId") chatId: string) {
    const chat = chats.get(chatId);
    if (chat) {
      chat.isActive = false;
      chat.updatedAt = new Date();
      return chat;
    }
    return { error: "Chat not found" };
  }
}
