'use client';

import { ChatPanel } from '@/src/features/chat/components/ChatPanel';

export default function ProviderChatPage() {
  return (
    <div className="min-w-0">
      <ChatPanel mode="provider" />
    </div>
  );
}
