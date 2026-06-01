'use client';

import { City } from "@/src/features/cities/types/city.types";
import Image from "next/image";

interface HeaderProps {
  city?: City;
}

export default function Header({ city }: HeaderProps) {
  const handleSearchClick = () => {
    const officeSection = document.getElementById("Fresh-Space");
    if (officeSection) {
      officeSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="w-full bg-canvas border-b border-hairline py-16 sm:py-20 md:py-24">
      <div className="max-w-[1130px] mx-auto px-4 sm:px-6 xl:px-0 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left: Text Contents */}
        <div className="lg:col-span-6 flex flex-col gap-6 items-start">
          
          {/* Badge */}
          <div className="flex items-center gap-2 rounded-full py-1.5 px-4 bg-ink text-white border border-ink shadow-sm">
            <img src="/assets/images/icons/crown-white.svg" className="w-4 h-4" alt="icon" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Workspace Pilihan Indonesia
            </span>
          </div>

          {/* Heading */}
          {city ? (
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight sm:tracking-[-0.03em] leading-[1.1] text-ink">
              Ruang Kerja Terbaik di <span className="text-primary font-semibold">{city.name}</span>
            </h1>
          ) : (
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight sm:tracking-[-0.03em] leading-[1.1] text-ink">
              Mencari Kantor Impian Jadi <span className="text-primary font-semibold">Lebih Mudah</span>
            </h1>
          )}

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-muted leading-relaxed max-w-[500px]">
            Platform terpercaya untuk menemukan ruang kerja yang dirancang untuk kenyamanan, produktivitas, dan pertumbuhan bisnis Anda. Cari, pilih, dan sewa kantor ideal Anda hari ini.
          </p>

          {/* CTA */}
          <button
            onClick={handleSearchClick}
            className="flex items-center gap-3.5 bg-primary hover:bg-primary-active text-white font-bold py-3.5 px-7 rounded-lg premium-transition cursor-pointer shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 text-sm sm:text-base"
          >
            <img src="/assets/images/icons/slider-horizontal-white.svg" className="w-5 h-5" alt="icon" />
            <span>Cari Sekarang</span>
          </button>
        </div>

        {/* Right: Premium Mockup/Image Frame */}
        <div className="lg:col-span-6 flex justify-center w-full">
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-square max-w-[500px] lg:max-w-none rounded-2xl border border-hairline bg-white p-2.5 shadow-sm premium-transition hover:border-primary/40">
            
            {/* The Image Container */}
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-canvas">
              <img 
                src={city ? city.image : "/assets/images/backgrounds/banner.webp"} 
                className="w-full h-full object-cover" 
                alt="hero workspace illustration" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent"></div>
            </div>

            {/* Floating Accents */}
            <div className="absolute -bottom-4 -left-4 sm:bottom-6 sm:-left-6 bg-white border border-hairline rounded-xl p-3 flex items-center gap-3 shadow-md">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <span className="text-lg">⭐</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-ink leading-tight">4.9/5 Rating Layanan</span>
                <span className="text-[10px] text-muted leading-tight">Berdasarkan 10K+ Penyewa</span>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-white border border-hairline rounded-xl p-3 flex items-center gap-3 shadow-md hidden sm:flex">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-ink leading-tight">Transaksi Aman</span>
                <span className="text-[10px] text-muted leading-tight">100% Terverifikasi</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </header>
  );
}