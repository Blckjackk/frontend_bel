'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { chatApi } from '../services/chat.api';
import { ChatPanelMode, ChatRoom, ChatSenderType } from '../types/chat.types';

const themeMap: Record<ChatPanelMode, { accent: string; selfType: ChatSenderType }> = {
  customer: { accent: '#0D903A', selfType: 'customer' },
  provider: { accent: '#FF852D', selfType: 'provider' },
  admin: { accent: '#0D903A', selfType: 'admin' },
};

interface ChatPanelProps {
  mode: ChatPanelMode;
}

function ChatPanelInner({ mode }: ChatPanelProps) {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialChatId = searchParams.get('chatId');

  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedIdRef = useRef<string | null>(null);
  const initializedRef = useRef(false);

  const { accent, selfType } = themeMap[mode];

  useEffect(() => {
    selectedIdRef.current = selectedChat?.id ?? null;
  }, [selectedChat?.id]);

  const fetchChats = useCallback(async () => {
    if (!user && mode !== 'admin') return;
    try {
      let data: ChatRoom[];
      if (mode === 'admin') {
        data = await chatApi.getAllChats();
      } else {
        const userType = mode === 'customer' ? 'customer' : 'provider';
        data = await chatApi.getUserChats(user!.id, userType);
      }
      setChats(data);

      const targetId = selectedIdRef.current ?? (initializedRef.current ? null : initialChatId);
      if (targetId) {
        const full = await chatApi.getChat(targetId);
        setSelectedChat(full);
        selectedIdRef.current = targetId;
      } else if (!initializedRef.current && data.length > 0) {
        const full = await chatApi.getChat(data[0].id);
        setSelectedChat(full);
        selectedIdRef.current = data[0].id;
      }
      initializedRef.current = true;
    } catch (err) {
      console.error('Failed to fetch chats:', err);
    } finally {
      setLoading(false);
    }
  }, [user, mode, initialChatId]);

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 4000);
    return () => clearInterval(interval);
  }, [fetchChats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages]);

  const handleSelectChat = async (chat: ChatRoom) => {
    const full = await chatApi.getChat(chat.id);
    setSelectedChat(full);
    selectedIdRef.current = chat.id;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat || !user) return;

    setSending(true);
    try {
      await chatApi.sendMessage(selectedChat.id, {
        message: messageInput.trim(),
        senderId: user.id,
        senderType: selfType,
        senderName: user.name,
      });
      setMessageInput('');
      const updated = await chatApi.getChat(selectedChat.id);
      setSelectedChat(updated);
      fetchChats();
    } catch (err) {
      console.error('Failed to send:', err);
    } finally {
      setSending(false);
    }
  };

  const handleCloseChat = async () => {
    if (!selectedChat) return;
    try {
      await chatApi.closeChat(selectedChat.id);
      const updated = await chatApi.getChat(selectedChat.id);
      setSelectedChat(updated);
      fetchChats();
    } catch (err) {
      console.error('Failed to close chat:', err);
    }
  };

  const getChatLabel = (chat: ChatRoom) => {
    if (mode === 'customer') return chat.officeTitle || `Office #${chat.officeId}`;
    if (mode === 'provider') return chat.customerName || `Customer #${chat.customerId.slice(-4)}`;
    return `${chat.customerName || 'Customer'} ↔ ${chat.officeTitle || `Office #${chat.officeId}`}`;
  };

  const getChatSubtitle = (chat: ChatRoom) => {
    const last = chat.messages[chat.messages.length - 1];
    return last?.message || 'Belum ada pesan';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: accent, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="flex gap-5 h-[calc(100vh-240px)] min-h-[620px]">
      <div className="w-[300px] shrink-0 bg-white rounded-[20px] border border-[#E0DEF7] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-[#E0DEF7]">
          <h2 className="font-bold text-[#000929]">{mode === 'admin' ? 'Semua Chat' : 'Percakapan'}</h2>
          <p className="text-xs opacity-50 mt-0.5">{chats.length} chat</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <p className="text-3xl mb-2">💬</p>
              <p className="text-sm opacity-50">
                {mode === 'customer' && 'Mulai chat dari halaman detail kantor'}
                {mode === 'provider' && 'Belum ada pesan dari customer'}
                {mode === 'admin' && 'Belum ada percakapan'}
              </p>
            </div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className="w-full px-4 py-3 border-b border-[#F6F5FD] flex items-center gap-3 text-left hover:bg-[#F7F7FD] transition-all"
                style={{
                  backgroundColor: selectedChat?.id === chat.id ? `${accent}10` : undefined,
                  borderLeft: selectedChat?.id === chat.id ? `3px solid ${accent}` : '3px solid transparent',
                }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ backgroundColor: accent }}>
                  {getChatLabel(chat).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm truncate">{getChatLabel(chat)}</p>
                    {!chat.isActive && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded shrink-0">Closed</span>}
                  </div>
                  <p className="text-xs opacity-50 truncate mt-0.5">{getChatSubtitle(chat)}</p>
                </div>
                {chat.unreadCount > 0 && (
                  <span className="w-5 h-5 text-white text-[10px] font-bold flex items-center justify-center rounded-full shrink-0" style={{ backgroundColor: accent }}>
                    {chat.unreadCount}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[20px] border border-[#E0DEF7] flex flex-col overflow-hidden">
        {selectedChat ? (
          <>
            <div className="px-5 py-4 border-b border-[#E0DEF7] flex items-center justify-between">
              <div>
                <p className="font-bold text-[#000929]">{getChatLabel(selectedChat)}</p>
                <p className="text-xs opacity-50 mt-0.5">
                  {mode === 'admin' && `Provider ID: ${selectedChat.officeProviderId} · `}
                  {selectedChat.isActive ? '● Aktif' : '● Ditutup'}
                </p>
              </div>
              {mode === 'admin' && selectedChat.isActive && (
                <button onClick={handleCloseChat} className="px-4 py-2 bg-[#FF2D2D] text-white rounded-full text-xs font-semibold hover:bg-red-700">
                  Tutup Chat
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3 bg-[#FAFAFA]">
              {selectedChat.messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-sm opacity-40">Belum ada pesan. Mulai percakapan!</div>
              ) : (
                selectedChat.messages.map((msg) => {
                  const isSelf = msg.senderType === selfType;
                  return (
                    <div key={msg.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[65%] rounded-2xl px-4 py-3 ${isSelf ? 'rounded-br-sm text-white' : 'rounded-bl-sm bg-white border border-[#E0DEF7] text-[#000929]'}`}
                        style={isSelf ? { backgroundColor: accent } : undefined}
                      >
                        {!isSelf && <p className="text-[10px] font-semibold mb-1 opacity-60 uppercase">{msg.senderName} · {msg.senderType}</p>}
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                        <p className={`text-[10px] mt-1 ${isSelf ? 'opacity-70 text-right' : 'opacity-40'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            {mode === 'admin' ? (
              <div className="px-5 py-4 border-t border-[#E0DEF7] text-center text-xs font-bold uppercase tracking-wider text-[#FF852D] bg-[#FF852D]/5">
                👁️ Admin dalam mode pantau (tidak dapat mengirim pesan)
              </div>
            ) : selectedChat.isActive ? (
              <form onSubmit={handleSendMessage} className="px-5 py-4 border-t border-[#E0DEF7] flex gap-3 bg-white">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Ketik pesan..."
                  className="flex-1 border border-[#E0DEF7] rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0D903A]"
                />
                <button type="submit" disabled={!messageInput.trim() || sending} className="text-white rounded-full px-6 py-3 font-semibold text-sm disabled:opacity-40" style={{ backgroundColor: accent }}>
                  Kirim
                </button>
              </form>
            ) : (
              <div className="px-5 py-4 border-t border-[#E0DEF7] text-center text-sm opacity-50 bg-[#F7F7FD]">
                Chat ini sudah ditutup oleh admin.
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center p-8">
            <p className="text-4xl">💬</p>
            <p className="font-semibold">Pilih percakapan</p>
            <p className="text-sm opacity-50">Klik chat di sidebar untuk mulai</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function ChatPanel(props: ChatPanelProps) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-[#0D903A] border-t-transparent rounded-full animate-spin" /></div>}>
      <ChatPanelInner {...props} />
    </Suspense>
  );
}
