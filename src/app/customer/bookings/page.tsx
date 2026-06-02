'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { mapOfficeDtoToOfficeSpace } from '@/src/features/offices/types/officeSpace.types';

interface Booking {
  id: number;
  booking_trx_id: string;
  user_id: number;
  office_id: number;
  price: number;
  duration: string;
  status: string;
  created_at: string;
  office?: any;
  transactions?: any[];
}

export default function CustomerBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!user?.id) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${apiUrl}/bookings/user/${user.id}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) fetchBookings();
  }, [user?.id, fetchBookings]);

  const handleUploadReceipt = async (bookingId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(bookingId);
    const formData = new FormData();
    formData.append('file', file);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const token = localStorage.getItem('token');
    const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};

    try {
      // 1. Upload proof file via client uploads route
      const uploadRes = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        alert('Gagal mengunggah bukti pembayaran.');
        return;
      }

      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.url;

      // 2. Submit payment proof path to Koa server
      const paymentRes = await fetch(`${apiUrl}/bookings/${bookingId}/payment`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({
          payment_proof: imageUrl,
          payment_method: 'Bank Transfer'
        }),
      });

      if (paymentRes.ok) {
        alert('Bukti pembayaran berhasil diunggah! Status menunggu konfirmasi provider.');
        fetchBookings();
      } else {
        alert('Gagal menyimpan transaksi pembayaran.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setUploadingId(null);
    }
  };

  const statusStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed': return 'bg-[#0D903A]';
      case 'paid':
      case 'pending':   return 'bg-[#FF852D]';
      case 'cancelled': return 'bg-[#FF2D2D]';
      default:          return 'bg-[#FF852D]';
    }
  };

  const statusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'completed': return 'Completed';
      case 'paid':      return 'Waiting Verification';
      case 'pending':   return 'Unpaid / Pending';
      case 'cancelled': return 'Cancelled';
      default:          return status;
    }
  };

  if (loadingBookings || !user) {
    return (
      <div className="flex items-center justify-center py-20 bg-canvas min-h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#0D903A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-muted font-bold uppercase tracking-wider">Memuat Booking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-canvas p-6 rounded-[20px]">
      <div className="bg-white border border-hairline rounded-[20px] p-6 shadow-sm">
        <h2 className="font-bold text-lg text-ink">My Bookings</h2>
        <p className="text-sm opacity-60 mt-1">Kelola semua pemesanan kantor Anda secara real-time</p>
      </div>

      <section className="flex flex-col gap-8">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-[20px] border border-hairline p-[60px] gap-5 text-center shadow-sm">
            <Image src="/assets/images/icons/receipt-text-black.svg" width={48} height={48} alt="" className="opacity-30" />
            <p className="text-lg font-semibold text-[#000929] opacity-60">
              Kamu belum punya booking terdaftar di database.
            </p>
            <Link
              href="/"
              className="flex items-center rounded-full p-[12px_30px] gap-3 bg-[#0D903A] text-white font-bold hover:bg-[#0B7A2F] transition-colors"
            >
              Cari Kantor Sekarang
            </Link>
          </div>
        ) : (
          bookings.map((booking) => {
            const office = booking.office ? mapOfficeDtoToOfficeSpace(booking.office) : null;
            const bookedDate = new Date(booking.created_at).toLocaleDateString('id-ID', {
              day: 'numeric', month: 'long', year: 'numeric',
            });

            return (
              <div key={booking.id} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* Left Card — Office + Customer */}
                <div className="flex flex-col h-fit shrink-0 rounded-[20px] border border-hairline p-6 sm:p-8 gap-6 bg-white shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex shrink-0 w-[120px] h-[90px] rounded-[16px] overflow-hidden border border-hairline relative">
                      <img
                        src={office?.image ?? '/assets/images/thumbnails/thumbnail-details-4.png'}
                        className="w-full h-full object-cover"
                        alt={office?.title || "Office Space"}
                        onError={(e) => { e.currentTarget.src = '/assets/images/thumbnails/thumbnail-details-4.png'; }}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <p className="font-bold text-lg text-ink leading-snug line-clamp-1">{office?.title || "Office Space"}</p>
                      <div className="flex items-center gap-1 text-xs text-muted font-medium">
                        <Image src="/assets/images/icons/location.svg" className="w-4 h-4 opacity-75" alt="icon" width={16} height={16} />
                        <p>{office?.location ?? 'Indonesia'}</p>
                      </div>
                    </div>
                  </div>

                  <hr className="border-hairline" />

                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-ink text-sm uppercase tracking-wider">Customer Details</h3>

                    <div className="flex flex-col gap-1.5">
                      <p className="text-xs font-bold text-muted uppercase tracking-wide">Nama Penyewa</p>
                      <div className="flex items-center rounded-lg px-4 py-2.5 gap-2.5 bg-canvas border border-hairline">
                        <img src="/assets/images/icons/security-user-black.svg" className="w-5 h-5 opacity-60" alt="icon" />
                        <p className="text-sm font-semibold text-ink">{user.name}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <p className="text-xs font-bold text-muted uppercase tracking-wide">Tanggal Transaksi</p>
                      <div className="flex items-center rounded-lg px-4 py-2.5 gap-2.5 bg-canvas border border-hairline">
                        <img src="/assets/images/icons/calendar-black.svg" className="w-5 h-5 opacity-60" alt="icon" />
                        <p className="text-sm font-semibold text-ink">{bookedDate}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <p className="text-xs font-bold text-muted uppercase tracking-wide">Durasi Sewa</p>
                      <div className="flex items-center rounded-lg px-4 py-2.5 gap-2.5 bg-canvas border border-hairline">
                        <img src="/assets/images/icons/clock.svg" className="w-5 h-5 opacity-60" alt="icon" />
                        <p className="text-sm font-semibold text-ink">{booking.duration}</p>
                      </div>
                    </div>
                  </div>

                  <hr className="border-hairline" />

                  <div className="flex items-center gap-2 text-xs text-muted font-medium">
                    <Image src="/assets/images/icons/shield-tick.svg" className="w-6 h-6 text-primary shrink-0" alt="icon" width={24} height={24} />
                    <p>Keamanan transaksi & privasi data terlindungi enkripsi end-to-end.</p>
                  </div>
                </div>

                {/* Right Card — Order Details & Payment Receipt Upload */}
                <div className="flex flex-col h-fit shrink-0 rounded-[20px] border border-hairline p-6 sm:p-8 gap-6 bg-white shadow-sm">
                  <h3 className="font-bold text-ink text-sm uppercase tracking-wider">Order & Billing Details</h3>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold opacity-70">Booking TRX ID</p>
                      <p className="font-bold text-sm text-ink">{booking.booking_trx_id}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold opacity-70">Status Transaksi</p>
                      <p className={`rounded-md w-fit px-3 py-1 ${statusStyle(booking.status)} font-bold text-[10px] uppercase tracking-wider text-white`}>
                        {statusText(booking.status)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold opacity-70">Durasi Kontrak</p>
                      <p className="font-bold text-sm text-ink">{booking.duration}</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-hairline pt-4 mt-2">
                      <p className="font-semibold text-ink">Total Tagihan</p>
                      <p className="font-bold text-xl text-[#0D903A]">
                        Rp {Number(booking.price || (booking as any).total_amount || 0).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>

                  <hr className="border-hairline" />

                  {/* unpaid - pending state payment coordinate */}
                  {booking.status === 'pending' && (
                    <div className="border border-dashed border-[#FF852D] rounded-xl p-5 bg-[#FF852D]/5 space-y-4 premium-transition animate-pulse-slow">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">💳</span>
                        <p className="font-bold text-[#FF852D] text-xs uppercase tracking-wider">Instruksi Pembayaran</p>
                      </div>
                      
                      <div className="space-y-3 text-xs text-ink/90">
                        <p className="leading-relaxed font-semibold">Silakan lakukan transfer tepat sesuai total tagihan ke salah satu rekening resmi OfficeHub di bawah ini:</p>
                        <div className="bg-white border border-hairline rounded-lg p-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-primary">BANK BCA</span>
                            <span className="font-mono font-bold tracking-wider text-ink select-all">123-456-7890</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] opacity-60">
                            <span>Atas Nama</span>
                            <span>OfficeHub Indonesia</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-ink/80 block">Unggah Bukti Transfer</label>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingId === booking.id}
                            onChange={(e) => handleUploadReceipt(booking.id, e)}
                            className="w-full text-xs border border-hairline rounded-lg px-3 py-2 bg-white cursor-pointer file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-[#FF852D]/10 file:text-[#FF852D] hover:file:bg-[#FF852D]/20"
                          />
                          {uploadingId === booking.id && (
                            <p className="text-[10px] text-[#FF852D] font-semibold">Memproses unggahan bukti bayar...</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* waiting verification receipt display */}
                  {booking.status === 'paid' && (
                    <div className="border border-[#0D903A] rounded-xl p-5 bg-[#0D903A]/5 space-y-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⏳</span>
                        <p className="font-bold text-[#0D903A] text-xs uppercase tracking-wider">Menunggu Verifikasi</p>
                      </div>
                      <p className="opacity-75 leading-relaxed font-medium">Bukti transfer Anda telah berhasil kami terima. Provider kami sedang memverifikasi pembayaran Anda. Proses ini biasanya memakan waktu maksimal 10-30 menit.</p>
                      {booking.transactions && booking.transactions.length > 0 && booking.transactions[0].payment_proof && (
                        <a
                          href={booking.transactions[0].payment_proof}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-2 bg-[#0D903A]/10 text-[#0D903A] px-3.5 py-2 rounded-full font-bold hover:bg-[#0D903A]/20 transition-all w-fit"
                        >
                          <span>Lihat Bukti Bayar Anda ↗</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* confirmed / completed state display */}
                  {booking.status === 'confirmed' && (
                    <div className="border border-[#0D903A] rounded-xl p-5 bg-[#0D903A]/10 space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">✅</span>
                        <p className="font-bold text-[#0D903A] text-xs uppercase tracking-wider">Pemesanan Terkonfirmasi</p>
                      </div>
                      <p className="opacity-75 leading-relaxed font-medium">Selamat! Kontrak sewa Anda resmi aktif. Detail kantor dan instruksi pemakaian telah aktif. Silakan hubungi Sales Representative atau mulai chat dengan Provider Anda.</p>
                    </div>
                  )}

                  <Link
                    href="/"
                    className="flex items-center justify-center w-full rounded-full border border-hairline p-[12px_20px] gap-3 bg-[#F7F7FD] text-ink font-semibold hover:bg-[#E0DEF7]/50 transition-colors text-sm"
                  >
                    <Image src="/assets/images/icons/call-black.svg" className="w-5 h-5" alt="icon" width={20} height={20} />
                    <span>Hubungi Layanan Bantuan</span>
                  </Link>
                </div>

              </div>
            );
          })
        )}
      </section>
    </div>
  );
}