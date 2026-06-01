'use client';

import { useEffect, useState } from 'react';
import { StatusBadge } from '@/src/features/dashboard/components/StatusBadge';
import { dashboardService } from '@/src/features/dashboard/services/dashboard.service';
import { DashboardBooking } from '@/src/features/dashboard/types/dashboard.types';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<DashboardBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    dashboardService.getAllBookings()
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

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
        <h2 className="font-bold text-lg text-[#000929] mb-6">Semua Booking ({bookings.length})</h2>

        {bookings.length === 0 ? (
          <p className="text-sm opacity-50 text-center py-12">Belum ada booking.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E0DEF7] text-left opacity-60">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Kantor</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Durasi</th>
                  <th className="pb-3 font-medium">Harga</th>
                  <th className="pb-3 font-medium">Tanggal</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-[#F7F7FD]">
                    <td className="py-4 font-semibold text-xs">{b.booking_trx_id || `#${String(b.id).padStart(4, '0')}`}</td>
                    <td className="py-4">{b.office?.name || b.office_title || `Office #${b.office_id}`}</td>
                    <td className="py-4">
                      <div>
                        <p className="font-medium">{b.user?.name ?? `User #${b.user_id}`}</p>
                        <p className="text-xs opacity-50">{b.user?.email}</p>
                      </div>
                    </td>
                    <td className="py-4">{b.duration}</td>
                    <td className="py-4 font-semibold text-[#0D903A]">Rp {Number(b.price).toLocaleString('id-ID')}</td>
                    <td className="py-4 opacity-70">
                      {new Date(b.created_at).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4">
                      <StatusBadge status={b.status} />
                    </td>
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
