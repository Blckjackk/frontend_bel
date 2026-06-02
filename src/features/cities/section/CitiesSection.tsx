"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CityCard from "../components/CityCard"; 
import { useState, useEffect } from "react";

export default function CitiesSection() {
  const [citiesList, setCitiesList] = useState<any[]>([]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    fetch(`${apiUrl}/cities`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCitiesList(data);
      })
      .catch((err) => console.error("Error fetching cities:", err));
  }, []);

  return (
    <section id="Cities" className="w-full bg-canvas border-b border-hairline py-16 sm:py-20">
      
      {/* Header */}
      <div className="w-full max-w-[1130px] mx-auto flex flex-col gap-2 px-4 sm:px-6 xl:px-0 mb-10">
        <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink leading-tight">
          Pilih Kota Favorit <br />Untuk Kantor Terbaik Anda
        </h2>
        <p className="text-xs sm:text-sm text-muted">
          Temukan ruang kerja strategis di kota-kota besar di seluruh Indonesia.
        </p>
      </div>

      {/* Swiper Component */}
      <div className="w-full">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={24}
          slidesPerView="auto"
          grabCursor={true}
          touchEventsTarget="wrapper"
          touchRatio={1}
          touchAngle={45}
          simulateTouch={true}
          allowTouchMove={true}
          className="!pb-6 w-full"
          style={{
            paddingLeft: "max(1rem, calc((100vw - 1130px) / 2))",
            paddingRight: "max(1rem, calc((100vw - 1130px) / 2))"
          }}
        >
          {citiesList.map((city) => (
            <SwiperSlide key={city.id} style={{ width: "auto" }}>
              <CityCard city={city} />
            </SwiperSlide> 
          ))}
        </Swiper>
      </div>

    </section>
  );
}