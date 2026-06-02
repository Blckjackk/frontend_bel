'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { StatusBadge } from '@/src/features/dashboard/components/StatusBadge';
import Image from 'next/image';

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
  transactions?: any[];
}

export default function ProviderBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!user?.id) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    try {
      // 1. Fetch provider offices to get their IDs
      const officeRes = await fetch(`${apiUrl}/offices?provider_id=${user.id}`);
      const officesData = await officeRes.json();
      const myOfficeIds = Array.isArray(officesData) ? officesData.map((o: any) => o.id) : [];

      // 2. Fetch all bookings and filter by provider office IDs
      const bookingRes = await fetch(`${apiUrl}/bookings/all`);
      const allBookings = await bookingRes.json();

      if (Array.isArray(allBookings)) {
        const filtered = allBookings.filter((b: any) => myOfficeIds.includes(b.office_id));
        setBookings(filtered);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchBookings();
  }, [user?.id, fetchBookings]);

  const handleStatusChange = async (id: number, nextStatus: string) => {
    if (nextStatus !== 'confirmed' && nextStatus !== 'cancelled') {
      alert('Hanya status Confirmed atau Cancelled yang dapat disetel oleh provider.');
      return;
    }

    setUpdatingId(id);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const token = localStorage.getItem('token');
    const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};
    try {
      const res = await fetch(`${apiUrl}/bookings/${id}/verify`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        alert('Status booking berhasil diperbarui!');
        fetchBookings();
      } else {
        alert('Gagal memverifikasi status booking.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-canvas min-h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#FF852D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-muted font-bold uppercase tracking-wider">Memuat Daftar Booking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-canvas p-6 rounded-[20px]">
      <div className="bg-white border border-hairline rounded-[20px] p-6 shadow-sm">
        <h2 className="font-bold text-lg text-[#000929] mb-1">Booking Kantor Saya ({bookings.length})</h2>
        <p className="text-sm opacity-60">Kelola dan verifikasi pemesanan ruang kantor Anda</p>
      </div>

      <div className="bg-white border border-hairline rounded-[20px] p-6 shadow-sm">
        {bookings.length === 0 ? (
          <p className="text-sm opacity-50 text-center py-12">Belum ada booking untuk kantor Anda di database.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-[#E0DEF7] text-ink opacity-60 text-xs font-bold uppercase tracking-wider">
                  <th className="pb-4 font-medium">TRX ID</th>
                  <th className="pb-4 font-medium">Kantor</th>
                  <th className="pb-4 font-medium">Customer</th>
                  <th className="pb-4 font-medium">Durasi</th>
                  <th className="pb-4 font-medium">Total Harga</th>
                  <th className="pb-4 font-medium">Tanggal</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Bukti Bayar</th>
                  <th className="pb-4 font-medium">Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F7FD]">
                {bookings.map((b) => {
                  const hasProof = b.transactions && b.transactions.length > 0 && b.transactions[0].payment_proof;
                  const proofPath = hasProof ? b.transactions![0].payment_proof : null;

                  return (
                    <tr key={b.id} className="hover:bg-canvas/40 transition-colors">
                      <td className="py-4 font-semibold text-ink">#{b.booking_trx_id}</td>
                      <td className="py-4 font-medium">{b.office?.name || `Office #${b.office_id}`}</td>
                      <td className="py-4">
                        <div>
                          <p className="font-semibold text-ink">{b.user?.name ?? `User #${b.user_id}`}</p>
                          <p className="text-[10px] opacity-50">{b.user?.email}</p>
                        </div>
                      </td>
                      <td className="py-4 text-muted">{b.duration}</td>
                      <td className="py-4 font-semibold text-[#FF852D]">Rp {Number(b.price || (b as any).total_amount || 0).toLocaleString('id-ID')}</td>
                      <td className="py-4 opacity-70 text-xs">
                        {new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-4">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="py-4">
                        {proofPath ? (
                          <button
                            onClick={() => setPreviewImage(proofPath)}
                            className="bg-[#0D903A]/10 hover:bg-[#0D903A]/20 text-[#0D903A] text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer"
                          >
                            Lihat Bukti ↗
                          </button>
                        ) : (
                          <span className="text-xs opacity-40">Belum Bayar</span>
                        )}
                      </td>
                      <td className="py-4">
                        <select
                          value={b.status}
                          disabled={updatingId === b.id}
                          onChange={(e) => handleStatusChange(b.id, e.target.value)}
                          className="border border-hairline rounded-full px-3 py-1.5 text-xs bg-[#F7F7FD] focus:outline-none focus:border-[#FF852D] font-bold text-ink cursor-pointer"
                        >
                          <option value="pending" disabled>Pending</option>
                          <option value="paid" disabled>Paid</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bukti Bayar Modal Preview */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 premium-transition">
          <div className="absolute inset-0" onClick={() => setPreviewImage(null)} />
          <div className="relative bg-white rounded-[20px] p-6 max-w-lg w-full border border-[#E0DEF7] flex flex-col items-center shadow-xl">
            <div className="flex items-center justify-between w-full border-b border-hairline pb-3 mb-4">
              <h3 className="font-bold text-ink text-sm uppercase tracking-wider">Proof of Payment Receipt</h3>
              <button
                onClick={() => setPreviewImage(null)}
                className="text-xs font-bold bg-canvas border border-hairline px-3 py-1 rounded-full text-ink/75 hover:bg-canvas/80"
              >
                Close
              </button>
            </div>
            <div className="w-full h-[320px] rounded-xl overflow-hidden border border-hairline relative bg-canvas">
              <img
                src={previewImage}
                alt="Payment proof receipt"
                className="w-full h-full object-contain"
                onError={(e) => { e.currentTarget.src = '/assets/images/thumbnails/thumbnail-details-4.png'; }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
