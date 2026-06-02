'use client';

import { use } from 'react';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mapOfficeDtoToOfficeSpace } from '@/src/features/offices/types/officeSpace.types';
import type { OfficeSpace } from '@/src/features/offices/types/officeSpace.types';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

interface DurationOption {
  label: string;
  days: number;
}

export default function BookingPage({ params }: { params: Props['params'] }) {
  const { slug } = use(params);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [office, setOffice] = useState<OfficeSpace | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(20);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const durationOptions: DurationOption[] = [
    { label: '10 Hari', days: 10 },
    { label: '15 Hari', days: 15 },
    { label: '20 Hari', days: 20 },
    { label: '30 Hari', days: 30 },
  ];

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (isLoading || !user) return;
    if (user.role === 'provider' || user.role === 'admin') {
      alert('Hanya customer yang bisa melakukan booking.');
      router.push(user.role === 'provider' ? '/provider' : '/admin');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!slug) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    fetch(`${apiUrl}/offices/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setOffice(mapOfficeDtoToOfficeSpace(data));
          setPageLoading(false);
        } else {
          router.push('/');
        }
      })
      .catch((err) => {
        console.error(err);
        router.push('/');
      });
  }, [slug, router]);

  const calculatePrice = () => {
    if (!office) return 0;
    const durationParts = office.duration.split(' ');
    const baseDays = parseInt(durationParts[0]) || 30;
    const pricePerDay = office.price / baseDays;
    return Math.round(pricePerDay * selectedDuration);
  };

  const handleBooking = async () => {
    if (!user || !office) {
      alert('Silakan login terlebih dahulu');
      return;
    }
    if (user.role === 'provider' || user.role === 'admin') {
      alert('Hanya customer yang bisa melakukan booking.');
      router.push(user.role === 'provider' ? '/provider' : '/admin');
      return;
    }
    if (office.isFullyBooked) {
      alert('Kantor ini sedang fully booked.');
      return;
    }

    setIsSubmitting(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${apiUrl}/bookings/create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          user_id: user.id,
          office_id: office.id,
          office_title: office.title,
          office_slug: office.slug,
          price: calculatePrice(),
          duration: `${selectedDuration} days`,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Booking berhasil dibuat!');
        router.push('/customer/bookings');
      } else {
        const err = await response.json();
        alert('Gagal booking: ' + (err.error || 'Terjadi kesalahan'));
      }
    } catch (error) {
      console.error('Error booking:', error);
      alert('Server backend tidak merespon. Pastikan backend OfficeHub Anda aktif.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-canvas">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs text-muted font-bold uppercase tracking-wider">Sedang Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (!office) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-canvas">
        <div className="text-center bg-white border border-hairline p-8 rounded-xl shadow-sm max-w-sm">
          <p className="text-base font-semibold text-ink mb-4">Ruang Kantor Tidak Ditemukan</p>
          <Link href="/" className="inline-block bg-primary hover:bg-primary-active text-white text-xs font-bold uppercase tracking-wider py-2 px-6 rounded-lg transition-colors">
            Kembali Ke Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      
      {/* Mini Nav */}
      <nav className="w-full bg-white border-b border-hairline sticky top-0 z-50">
        <div className="flex items-center justify-between w-full max-w-[1130px] py-4 px-4 sm:px-6 xl:px-0 mx-auto">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Image src="/assets/images/logos/logo.svg" alt="logo" width={130} height={35} className="w-auto h-8 object-contain" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xs font-semibold text-muted hover:text-primary transition-colors">KEMBALI KE HOME</Link>
            <div className="flex items-center gap-2 bg-canvas border border-hairline py-1.5 px-3 rounded-lg">
              <span className="text-xs font-semibold text-ink">{user.name}</span>
              <span className="bg-primary text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                Customer
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="w-full max-w-[1130px] mx-auto px-4 sm:px-6 xl:px-0 py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Block */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white rounded-xl border border-hairline p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
              
              {/* Image Cover */}
              <div className="overflow-hidden rounded-xl border border-hairline p-1 bg-canvas h-[280px] sm:h-[340px]">
                <Image 
                  src={office.image} 
                  alt={office.title} 
                  width={800} 
                  height={340} 
                  className="w-full h-full object-cover rounded-lg" 
                />
              </div>

              {/* Title & Info */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Konfirmasi Booking</span>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink leading-tight">{office.title}</h2>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted font-medium mt-1">
                  <Image src="/assets/images/icons/location.svg" className="w-4 h-4 opacity-75" alt="location icon" width={16} height={16} />
                  <p>{office.location}</p>
                </div>
              </div>

              <hr className="border-hairline" />

              {/* About description */}
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-sm text-ink uppercase tracking-wider">Tentang Ruang Kerja</h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed whitespace-pre-line">{office.about}</p>
              </div>

              <hr className="border-hairline" />

              {/* Included specifications */}
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-sm text-ink uppercase tracking-wider">Fasilitas yang Anda Dapatkan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {office.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2.5 text-xs sm:text-sm text-muted font-medium">
                      <Image src="/assets/images/icons/verify.svg" className="w-5 h-5 shrink-0" alt="verify icon" width={20} height={20} />
                      <p className="font-semibold">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right Block (Summary Card) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-xl border border-hairline p-6 flex flex-col gap-6 shadow-sm">
              
              {/* Pricing details */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-soft">Total Pembayaran</span>
                <p className="font-bold text-2xl sm:text-3xl text-primary leading-none">
                  Rp {calculatePrice().toLocaleString('id-ID')}
                </p>
                <p className="text-xs text-muted font-semibold mt-1">Estimasi untuk: {selectedDuration} hari kerja</p>
              </div>

              <hr className="border-hairline" />

              {/* Duration selector */}
              <div className="flex flex-col gap-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink">Pilih Durasi Sewa</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {durationOptions.map((option) => (
                    <button
                      key={option.days}
                      onClick={() => setSelectedDuration(option.days)}
                      className={`py-2.5 px-3 rounded-lg border font-semibold text-xs sm:text-sm premium-transition cursor-pointer ${
                        selectedDuration === option.days
                          ? 'border-primary bg-primary text-white shadow-sm shadow-primary/10'
                          : 'border-hairline bg-canvas text-ink hover:border-primary/50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-hairline" />

              {/* Guarantees list */}
              <div className="flex flex-col gap-3 text-xs text-muted">
                {[
                  "Konfirmasi instan dari Provider",
                  "Kebijakan pembatalan fleksibel",
                  "Layanan dukungan pelanggan 24/7"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Image src="/assets/images/icons/verify.svg" className="w-4 h-4 shrink-0" alt="icon" width={16} height={16} />
                    <p className="font-semibold">{text}</p>
                  </div>
                ))}
              </div>

              <hr className="border-hairline" />

              {/* Action Button */}
              <button
                onClick={handleBooking}
                disabled={isSubmitting}
                className="w-full rounded-lg py-3.5 bg-primary hover:bg-primary-active text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm cursor-pointer shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Memproses Transaksi...</span>
                  </>
                ) : (
                  <>
                    <Image src="/assets/images/icons/slider-horizontal-white.svg" className="w-5 h-5" alt="icon" width={20} height={20} />
                    <span>Konfirmasi Booking</span>
                  </>
                )}
              </button>
              
              <p className="text-[10px] text-muted-soft text-center leading-relaxed">
                Pembayaran Anda aman. Kelola pemesanan langsung melalui dashboard pelanggan kapan saja.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}