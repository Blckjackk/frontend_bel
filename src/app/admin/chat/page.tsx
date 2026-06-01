'use client';

import { ChatPanel } from '@/src/features/chat/components/ChatPanel';

export default function AdminChatPage() {
  return (
    <div className="min-w-0">
      <ChatPanel mode="admin" />
    </div>
  );
}
