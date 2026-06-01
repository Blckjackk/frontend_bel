'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { StatCard } from '@/src/features/dashboard/components/StatCard';
import { StatusBadge } from '@/src/features/dashboard/components/StatusBadge';
import { dashboardService } from '@/src/features/dashboard/services/dashboard.service';
import { DashboardBooking, DashboardUser } from '@/src/features/dashboard/types/dashboard.types';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [bookings, setBookings] = useState<DashboardBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardService.getUsers().catch(() => []),
      dashboardService.getAllBookings().catch(() => []),
    ]).then(([usersData, bookingsData]) => {
      setUsers(Array.isArray(usersData) ? usersData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setLoading(false);
    });
  }, []);

  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const providers = users.filter((u) => u.role === 'provider' || u.role === 'office_provider').length;
  const customers = users.filter((u) => u.role === 'customer' || u.role === 'user').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#0D903A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white border border-[#E0DEF7] rounded-[20px] p-6">
        <h2 className="font-bold text-lg text-[#000929]">Selamat datang, {user?.name}</h2>
        <p className="text-sm text-[#000929] opacity-60 mt-1">Kelola platform OfficeHub dari panel admin ini.</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <StatCard label="Total Users" value={users.length} icon="👥" />
        <StatCard label="Customers" value={customers} icon="🧑" />
        <StatCard label="Providers" value={providers} icon="🏢" />
        <StatCard label="Pending Bookings" value={pendingBookings} icon="⏳" accent="#FF852D" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Link href="/admin/users" className="p-6 bg-white border border-[#E0DEF7] rounded-[20px] hover:border-[#0D903A] hover:shadow-md transition-all">
          <h3 className="font-semibold text-[#000929] mb-1">👥 Manage Users</h3>
          <p className="text-sm opacity-60">Lihat dan kelola semua pengguna platform</p>
        </Link>
        <Link href="/admin/bookings" className="p-6 bg-white border border-[#E0DEF7] rounded-[20px] hover:border-[#0D903A] hover:shadow-md transition-all">
          <h3 className="font-semibold text-[#000929] mb-1">📋 Monitor Bookings</h3>
          <p className="text-sm opacity-60">Lihat dan pantau status pemesanan</p>
        </Link>
        <Link href="/" className="p-6 bg-white border border-[#E0DEF7] rounded-[20px] hover:border-[#0D903A] hover:shadow-md transition-all">
          <h3 className="font-semibold text-[#000929] mb-1">🌐 Browse Site</h3>
          <p className="text-sm opacity-60">Lihat halaman publik website</p>
        </Link>
      </div>

      <div className="bg-white border border-[#E0DEF7] rounded-[20px] p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className="font-bold text-[#000929]">Booking Terbaru</h3>
          <Link href="/admin/bookings" className="text-sm font-semibold text-[#0D903A] hover:underline">Lihat semua</Link>
        </div>
        {bookings.length === 0 ? (
          <p className="text-sm opacity-50 text-center py-8">Belum ada booking.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E0DEF7] text-left opacity-60">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Kantor</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Harga</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="border-b border-[#F7F7FD]">
                    <td className="py-3 font-semibold">#{String(b.id).padStart(4, '0')}</td>
                    <td className="py-3">{b.office?.name || b.office_title || `Office #${b.office_id}`}</td>
                    <td className="py-3">{b.user?.name ?? `User #${b.user_id}`}</td>
                    <td className="py-3">Rp {Number(b.price).toLocaleString('id-ID')}</td>
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
