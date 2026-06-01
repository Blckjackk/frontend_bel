'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { StatCard } from '@/src/features/dashboard/components/StatCard';
import { StatusBadge } from '@/src/features/dashboard/components/StatusBadge';

interface Booking {
  id: number;
  booking_trx_id: string;
  user_id: number;
  office_id: number;
  price: number;
  duration: string;
  status: string;
  created_at: string;
  user?: { id: number; name: string; email: string };
  office?: any;
}

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [officesCount, setOfficesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) return;
    try {
      // 1. Fetch provider offices
      const officeRes = await fetch(`http://localhost:5000/api/offices?provider_id=${user.id}`);
      const officesData = await officeRes.json();
      const myOfficeIds = Array.isArray(officesData) ? officesData.map((o: any) => o.id) : [];
      setOfficesCount(myOfficeIds.length);

      // 2. Fetch all bookings and filter by provider office IDs
      const bookingRes = await fetch('http://localhost:5000/api/bookings/all');
      const allBookings = await bookingRes.json();

      if (Array.isArray(allBookings)) {
        const filtered = allBookings.filter((b: any) => myOfficeIds.includes(b.office_id));
        setBookings(filtered);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id, fetchDashboardData]);

  const pending = bookings.filter((b) => b.status === 'pending' || b.status === 'paid').length;
  const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
  const revenue = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, b) => sum + Number(b.price), 0);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center py-20 bg-canvas min-h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#FF852D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-muted font-bold uppercase tracking-wider">Memuat Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-canvas p-6 rounded-[20px]">
      <div className="bg-white border border-hairline rounded-[20px] p-6 shadow-sm">
        <h2 className="font-bold text-lg text-[#000929]">Selamat datang, {user.name}</h2>
        <p className="text-sm text-[#000929] opacity-60 mt-1">Kelola kantor dan pemesanan dari panel provider ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Kantor Saya" value={officesCount} icon="🏢" accent="#FF852D" />
        <StatCard label="Total Booking" value={bookings.length} icon="📅" accent="#FF852D" />
        <StatCard label="Pending / Paid" value={pending} icon="⏳" accent="#FF852D" />
        <StatCard label="Pendapatan" value={`Rp ${revenue.toLocaleString('id-ID')}`} icon="💰" accent="#FF852D" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/provider/offices" className="p-6 bg-white border border-hairline rounded-[20px] hover:border-[#FF852D] hover:shadow-md transition-all shadow-sm">
          <h3 className="font-semibold text-[#000929] mb-1">🏢 Kelola Kantor</h3>
          <p className="text-sm opacity-60">Lihat dan kelola listing kantor Anda</p>
        </Link>
        <Link href="/provider/bookings" className="p-6 bg-white border border-hairline rounded-[20px] hover:border-[#FF852D] hover:shadow-md transition-all shadow-sm">
          <h3 className="font-semibold text-[#000929] mb-1">📅 Lihat Bookings</h3>
          <p className="text-sm opacity-60">Konfirmasi pemesanan dari customer</p>
        </Link>
        <Link href="/" className="p-6 bg-white border border-hairline rounded-[20px] hover:border-[#FF852D] hover:shadow-md transition-all shadow-sm">
          <h3 className="font-semibold text-[#000929] mb-1">🌐 Lihat Website</h3>
          <p className="text-sm opacity-60">Preview halaman publik kantor Anda</p>
        </Link>
      </div>

      <div className="bg-white border border-hairline rounded-[20px] p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className="font-bold text-[#000929]">Booking Terbaru</h3>
          <Link href="/provider/bookings" className="text-sm font-semibold text-[#FF852D] hover:underline">Lihat semua</Link>
        </div>
        {bookings.length === 0 ? (
          <p className="text-sm opacity-50 text-center py-8">Belum ada booking untuk kantor Anda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-[#E0DEF7] text-ink opacity-60 text-xs font-bold uppercase tracking-wider">
                  <th className="pb-3 font-medium">TRX ID</th>
                  <th className="pb-3 font-medium">Kantor</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Harga</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F7FD]">
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id}>
                    <td className="py-3 font-semibold text-ink">#{b.booking_trx_id}</td>
                    <td className="py-3 font-medium">{b.office?.name || `Office #${b.office_id}`}</td>
                    <td className="py-3">{b.user?.name ?? `User #${b.user_id}`}</td>
                    <td className="py-3 font-semibold text-[#FF852D]">Rp {Number(b.price).toLocaleString('id-ID')}</td>
                    <td className="py-3"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
