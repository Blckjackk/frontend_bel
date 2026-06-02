'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { mapOfficeDtoToOfficeSpace } from '@/src/features/offices/types/officeSpace.types';

interface WishlistItem {
  id: number;
  office_id: number;
  created_at: string;
  office?: any;
}

export default function WishlistPage() {
  const { user } = useAuth();
  const [wishlists, setWishlists] = useState<WishlistItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchWishlists = useCallback(async () => {
    if (!user?.id) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    try {
      const res = await fetch(`${apiUrl}/favorites/user/${user.id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch wishlists');
      }
      const data = await res.json();
      setWishlists(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch wishlists:', error);
    } finally {
      setLoadingData(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) fetchWishlists();
  }, [user?.id, fetchWishlists]);

  const handleRemove = async (id: number) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    try {
      const res = await fetch(`${apiUrl}/favorites/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Failed to remove wishlist');
      }
      setWishlists(wishlists.filter((w) => w.id !== id));
    } catch (error) {
      console.error('Failed to remove wishlist:', error);
    }
  };

  if (loadingData || !user) {
    return (
      <div className="flex items-center justify-center py-20 bg-canvas min-h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#0D903A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-muted font-bold uppercase tracking-wider">Memuat Wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-canvas p-6 rounded-[20px]">
      <div className="bg-white border border-hairline rounded-[20px] p-6 shadow-sm">
        <h2 className="font-bold text-lg text-ink">My Wishlist</h2>
        <p className="text-sm opacity-60 mt-1">Daftar ruang kantor favorit pilihan Anda</p>
      </div>

      {wishlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3 bg-white rounded-[20px] border border-hairline shadow-sm">
          <div className="text-4xl">💾</div>
          <p className="font-semibold text-ink">Wishlist kosong</p>
          <p className="text-xs opacity-50 max-w-[280px]">Simpan ruang kantor favorit dari halaman detail kantor untuk melihatnya di sini.</p>
          <Link href="/" className="mt-2 px-6 py-2.5 bg-[#0D903A] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#0B7A2F] transition-all cursor-pointer">
            Cari Kantor Sekarang
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlists.map((item) => {
            const office = item.office ? mapOfficeDtoToOfficeSpace(item.office) : null;
            if (!office) return null;

            return (
              <div key={item.id} className="flex flex-col rounded-[20px] border border-hairline bg-white overflow-hidden shadow-sm">
                <div className="relative w-full h-[180px]">
                  <img src={office.image} alt={office.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/assets/images/thumbnails/thumbnails-1.png'; }} />
                </div>
                <div className="flex flex-col p-5 gap-3">
                  <h3 className="font-bold text-ink leading-snug line-clamp-1">{office.title}</h3>
                  <p className="text-xs opacity-50">{office.location}</p>
                  <p className="font-bold text-[#0D903A]">Rp {office.price.toLocaleString('id-ID')}</p>
                  <div className="flex gap-2 mt-2 pt-2 border-t border-hairline">
                    <Link href={`/office/${office.slug}`} className="flex-1 text-center py-2 rounded-full bg-[#0D903A] hover:bg-[#0B7A2F] text-white text-xs font-bold transition-all">
                      Lihat Detail
                    </Link>
                    <button onClick={() => handleRemove(item.id)} className="px-4 py-2 rounded-full border border-[#FF2D2D] text-[#FF2D2D] hover:bg-[#FF2D2D] hover:text-white text-xs font-bold transition-all cursor-pointer">
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
