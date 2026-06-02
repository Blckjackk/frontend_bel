'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/src/features/auth/context/AuthContext';

interface Props {
  officeId: number;
  officeTitle: string;
  officeSlug: string;
  officeImage: string;
  officePrice: number;
  officeLocation: string;
}

export default function SaveForLaterButton({ officeId, officeTitle, officeSlug, officeImage, officePrice, officeLocation }: Props) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favoriteId, setFavoriteId] = useState<number | null>(null);

  const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  // Check if already saved
  useEffect(() => {
    if (!user) return;
    fetch(`${getApiUrl()}/favorites/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const found = data.find(f => Number(f.office_id) === Number(officeId));
          if (found) {
            setSaved(true);
            setFavoriteId(found.id);
          }
        }
      })
      .catch(err => console.error("Error loading favorites:", err));
  }, [user, officeId]);

  const handleSave = async () => {
    if (!user) {
      window.location.href = '/auth/login';
      return;
    }
    setLoading(true);
    const apiUrl = getApiUrl();
    try {
      if (saved && favoriteId) {
        // Toggle off if already saved
        const res = await fetch(`${apiUrl}/favorites/${favoriteId}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          setSaved(false);
          setFavoriteId(null);
        }
      } else {
        // Save to favorites
        const res = await fetch(`${apiUrl}/favorites/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            office_id: officeId
          }),
        });
        if (res.ok) {
          const result = await res.json();
          setSaved(true);
          if (result.data) {
            setFavoriteId(result.data.id);
          }
          window.location.href = '/customer/wishlist';
        }
      }
    } catch {
      console.error('Failed to toggle save for later');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={loading}
      className={`flex items-center justify-center w-full rounded-full border p-[16px_26px] gap-3 font-semibold transition-all cursor-pointer ${
        saved
          ? 'border-[#0D903A] text-[#0D903A] bg-[#f0faf0]'
          : 'border-[#000929] bg-white hover:bg-gray-50'
      }`}
    >
      <Image src="/assets/images/icons/save-add.svg" className="w-6 h-6" alt="icon" width={24} height={24} />
      <span>{saved ? 'Saved!' : loading ? 'Saving...' : 'Save for Later'}</span>
    </button>
  );
}