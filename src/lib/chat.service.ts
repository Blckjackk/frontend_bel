export interface CreateChatPayload {
  customerId: string;
  officeId: number;
  officeProviderId: string;
}

export async function createChat(payload: CreateChatPayload) {
  try {
    const response = await fetch('/api/chats/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create chat');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Chat service error:', error);
    throw error;
  }
}

export async function sendMessage(chatId: string, message: string) {
  try {
    const response = await fetch(`/api/chats/${chatId}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatId, message }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Send message error:', error);
    throw error;
  }
}

export async function getChat(chatId: string) {
  try {
    const response = await fetch(`/api/chats/${chatId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch chat');
    }

    return await response.json();
  } catch (error) {
    console.error('Get chat error:', error);
    throw error;
  }
}

export async function getUserChats(userId: string, userType: 'customer' | 'provider' | 'admin' = 'customer') {
  try {
    const response = await fetch(`/api/chats/user/${userId}?userType=${userType}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user chats');
    }

    return await response.json();
  } catch (error) {
    console.error('Get user chats error:', error);
    throw error;
  }
}
