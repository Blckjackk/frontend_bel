'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Contact } from '../types/officeSpace.types';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { chatApi } from '@/src/features/chat/services/chat.api';

interface Props {
  contact: Contact;
  officeId?: number;
  officeTitle?: string;
  officeProviderId?: number;
}

export default function SalesContactCard({ contact, officeId, officeTitle, officeProviderId }: Props) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleStartChat = async () => {
    if (!isAuthenticated || !user) {
      router.push('/auth/login');
      return;
    }
    if (user.role !== 'customer') {
      alert('Hanya customer yang bisa memulai chat dengan sales.');
      return;
    }

    const phone = contact.phone || '6281234567890';
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    const message = encodeURIComponent(`Halo ${contact.name}, saya tertarik dengan kantor "${officeTitle || 'ini'}". Apakah masih tersedia?`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-4">
        <div className="w-[60px] h-[60px] rounded-full overflow-hidden relative">
          <img
            src={contact.photo || '/assets/images/photos/photo-1.png'}
            className="w-full h-full object-cover"
            alt={contact.name}
            onError={(e) => { e.currentTarget.src = '/assets/images/photos/photo-1.png'; }}
          />
        </div>
        <div className="flex flex-col gap-[2px]">
          <p className="font-bold">{contact.name}</p>
          <p className="text-sm leading-[21px]">{contact.role}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link href={`tel:${contact.phone}`}>
          <Image src="/assets/images/icons/call-green.svg" className="w-10 h-10 cursor-pointer hover:opacity-80" alt="call" width={40} height={40} />
        </Link>
        <button onClick={handleStartChat} className="hover:opacity-80 transition" title="Start chat">
          <Image src="/assets/images/icons/chat-green.svg" className="w-10 h-10 cursor-pointer" alt="chat" width={40} height={40} />
        </button>
      </div>
    </div>
  );
}
