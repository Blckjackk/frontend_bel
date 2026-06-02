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
  phoneNumber?: string;
  contactName?: string;
}

export function StartChatButton({
  officeId,
  officeTitle,
  officeProviderId,
  className,
  label,
  phoneNumber,
  contactName,
}: StartChatButtonProps) {
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

    const phone = phoneNumber || '6281234567890';
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    const nameStr = contactName ? ` ${contactName}` : '';
    const message = encodeURIComponent(`Halo${nameStr}, saya tertarik dengan kantor "${officeTitle}". Apakah masih tersedia?`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
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
