'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { chatApi } from '@/src/features/chat/services/chat.api';

interface StartChatButtonProps {
  officeId: number;
  officeTitle: string;
  officeProviderId: number;
  className?: string;
  label?: string;
}

export function StartChatButton({ officeId, officeTitle, officeProviderId, className, label }: StartChatButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleStartChat = async () => {
    if (!isAuthenticated || !user) {
      router.push('/auth/login');
      return;
    }

    if (user.role !== 'customer') {
      alert('Hanya customer yang bisa memulai chat dengan provider.');
      return;
    }

    try {
      const chat = await chatApi.createChat({
        customerId: user.id,
        customerName: user.name,
        officeId,
        officeTitle,
        officeProviderId: String(officeProviderId),
      });
      router.push(`/customer/chat?chatId=${chat.id}`);
    } catch {
      alert('Gagal memulai chat. Coba lagi.');
    }
  };

  return (
    <button
      onClick={handleStartChat}
      className={className ?? 'flex items-center justify-center w-full rounded-full p-[16px_26px] gap-3 border border-[#0D903A] font-bold text-[#0D903A] hover:bg-[#0D903A] hover:text-white transition-colors'}
    >
      💬 {label ?? 'Chat dengan Provider'}
    </button>
  );
}
