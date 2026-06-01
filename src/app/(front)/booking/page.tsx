import { Metadata } from "next";
import Navbar from "@/src/components/Navbar";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Cek Pemesanan | OfficeHub",
  description: "Lihat detail dan status transaksi pemesanan ruang kantor Anda secara aman.",
};

export default function BookingDetailsPage() {
  return (
    <>
      <Navbar />

      {/* Banner */}
      <div
        id="Banner"
        className="w-full bg-ink border-b border-hairline py-16 text-center flex flex-col gap-3 justify-center items-center relative overflow-hidden"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight sm:tracking-[-0.02em] leading-tight text-white z-20">
          Cek Detail Pemesanan Anda
        </h1>
        <p className="text-xs sm:text-sm text-white/70 max-w-[500px] leading-relaxed z-20 px-4">
          Masukkan TRX ID dan nomor telepon terdaftar untuk melacak status pemesanan kantor Anda secara langsung.
        </p>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent z-10" />
        <img
          src="/assets/images/backgrounds/banner.webp"
          className="absolute w-full h-full object-cover object-center opacity-40 blur-xs"
          alt="booking background"
        />
      </div>

      {/* Main Section */}
      <section
        id="Check-Booking"
        className="w-full max-w-[930px] mx-auto px-4 py-12 flex flex-col gap-8 z-20 relative -mt-8"
      >
        {/* Form Container */}
        <form
          action=""
          className="flex flex-col md:flex-row items-stretch md:items-end rounded-xl border border-hairline p-6 sm:p-8 gap-4 bg-white shadow-sm"
        >
          {/* TRX Input */}
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-ink">
              Booking TRX ID
            </label>
            <div className="flex items-center rounded-lg border border-hairline px-4 gap-2.5 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary w-full bg-canvas">
              <Image
                src="/assets/images/icons/receipt-text-black.svg"
                className="w-5 h-5 opacity-70"
                alt="receipt icon"
                width={20}
                height={20}
              />
              <input
                type="text"
                name="name"
                id="name"
                className="appearance-none outline-none w-full py-3 font-semibold text-xs sm:text-sm text-ink placeholder:font-normal placeholder:text-muted bg-transparent"
                placeholder="Masukkan TRX ID pemesanan Anda"
              />
            </div>
          </div>

          {/* Phone Input */}
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-ink">
              Nomor Telepon
            </label>
            <div className="flex items-center rounded-lg border border-hairline px-4 gap-2.5 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary w-full bg-canvas">
              <Image
                src="/assets/images/icons/call-black.svg"
                className="w-5 h-5 opacity-70"
                alt="call icon"
                width={20}
                height={20}
              />
              <input
                type="tel"
                name="phone"
                id="phone"
                className="appearance-none outline-none w-full py-3 font-semibold text-xs sm:text-sm text-ink placeholder:font-normal placeholder:text-muted bg-transparent"
                placeholder="Masukkan nomor HP Anda"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="flex items-center justify-center rounded-lg py-3.5 px-6 gap-2 bg-primary hover:bg-primary-active font-bold text-white shadow-sm premium-transition cursor-pointer text-sm h-11"
          >
            <span className="text-nowrap">Cek Booking</span>
          </button>
        </form>

        {/* Demo Result Grid */}
        <div id="Result" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card Left: Specs */}
          <div className="flex flex-col h-fit rounded-xl border border-hairline p-6 gap-6 bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex shrink-0 w-24 h-20 rounded-lg overflow-hidden border border-hairline">
                <img
                  src="/assets/images/thumbnails/thumbnail-details-4.png"
                  className="w-full h-full object-cover"
                  alt="thumbnail"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="font-semibold text-base sm:text-lg text-ink tracking-tight leading-tight">
                  Angga Park Central
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted font-medium">
                  <Image
                    src="/assets/images/icons/location.svg"
                    className="w-4 h-4 opacity-75"
                    alt="location icon"
                    width={16}
                    height={16}
                  />
                  <p>Jakarta Pusat</p>
                </div>
              </div>
            </div>
            
            <hr className="border-hairline" />

            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-ink">Detail Pelanggan</h3>
              
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-soft">Nama Lengkap</span>
                <div className="flex items-center rounded-lg px-4 py-2.5 gap-2.5 bg-canvas border border-hairline text-xs font-semibold text-ink">
                  <img
                    src="/assets/images/icons/security-user-black.svg"
                    className="w-5 h-5 opacity-70"
                    alt="user icon"
                  />
                  <p>Angga Risky Setiawan</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-soft">Nomor Telepon</span>
                <div className="flex items-center rounded-lg px-4 py-2.5 gap-2.5 bg-canvas border border-hairline text-xs font-semibold text-ink">
                  <Image
                    src="/assets/images/icons/call-black.svg"
                    className="w-5 h-5 opacity-70"
                    alt="phone icon"
                    width={20}
                    height={20}
                  />
                  <p>6289123981239</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-soft">Tanggal Mulai</span>
                  <div className="flex items-center rounded-lg px-3 py-2.5 gap-2 bg-canvas border border-hairline text-[11px] font-semibold text-ink">
                    <img
                      src="/assets/images/icons/calendar-black.svg"
                      className="w-4 h-4 opacity-70"
                      alt="calendar icon"
                    />
                    <p>12 July 2024</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-soft">Tanggal Selesai</span>
                  <div className="flex items-center rounded-lg px-3 py-2.5 gap-2 bg-canvas border border-hairline text-[11px] font-semibold text-ink">
                    <img
                      src="/assets/images/icons/calendar-black.svg"
                      className="w-4 h-4 opacity-70"
                      alt="calendar icon"
                    />
                    <p>20 July 2024</p>
                  </div>
                </div>
              </div>

            </div>

            <hr className="border-hairline" />

            <div className="flex items-center gap-2.5 text-xs text-muted">
              <Image
                src="/assets/images/icons/shield-tick.svg"
                className="w-5 h-5 shrink-0"
                alt="shield icon"
                width={20}
                height={20}
              />
              <p className="font-semibold">
                Privasi dan keamanan transaksi Anda terjamin 100%.
              </p>
            </div>
          </div>

          {/* Card Right: Checkout Info */}
          <div className="flex flex-col h-fit rounded-xl border border-hairline p-6 gap-6 bg-white shadow-sm">
            <h3 className="font-bold text-xs uppercase tracking-wider text-ink">Rincian Pemesanan</h3>
            
            <div className="flex flex-col gap-4 text-xs text-muted font-medium">
              <div className="flex items-center justify-between border-b border-hairline pb-3">
                <p>Status Pembayaran</p>
                <span className="rounded-md bg-accent font-bold text-[10px] uppercase tracking-wider px-3 py-1 text-white shadow-sm">
                  PENDING
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-hairline pb-3">
                <p>Status Verifikasi</p>
                <span className="rounded-md bg-primary font-bold text-[10px] uppercase tracking-wider px-3 py-1 text-white shadow-sm">
                  SUCCESS
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-hairline pb-3">
                <p>Booking TRX ID</p>
                <p className="font-bold text-ink">FO1239812938</p>
              </div>
              <div className="flex items-center justify-between border-b border-hairline pb-3">
                <p>Durasi Sewa</p>
                <p className="font-bold text-ink">20 Hari Kerja</p>
              </div>
              <div className="flex items-center justify-between pt-1">
                <p>Total Harga</p>
                <p className="font-bold text-lg sm:text-xl text-primary">
                  Rp 249.660
                </p>
              </div>
            </div>

            <hr className="border-hairline" />

            {/* Support CTA */}
            <a
              href="tel:62812345678"
              className="flex items-center justify-center w-full rounded-lg border border-hairline py-3 px-6 gap-2 bg-white text-ink hover:text-primary hover:border-primary font-bold text-sm premium-transition shadow-sm"
            >
              <Image
                src="/assets/images/icons/call-black.svg"
                className="w-5 h-5 opacity-70"
                alt="call icon"
                width={20}
                height={20}
              />
              <span>Hubungi Customer Service</span>
            </a>
          </div>

        </div>
      </section>
    </>
  );
}

