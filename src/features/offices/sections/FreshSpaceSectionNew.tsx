"use client";

import OfficeSpaceCard from "../components/OfficeSpaceCard";
import { useState, useEffect } from "react";
import type { OfficeSpace } from "../types/officeSpace.types";
import { mapOfficeDtoToOfficeSpace } from "../types/officeSpace.types";

export default function FreshSpaceSection() {
  const [offices, setOffices] = useState<OfficeSpace[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    fetch(`${apiUrl}/offices`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOffices(data.map(mapOfficeDtoToOfficeSpace));
        }
      })
      .catch((err) => console.error("Error fetching offices:", err))
      .finally(() => setIsHydrated(true));
  }, []);

  return (
    <section
      id="Fresh-Space"
      className="w-full max-w-[1130px] mx-auto py-16 sm:py-20 px-4 sm:px-6 xl:px-0"
    >
      {/* Header */}
      <div className="flex flex-col gap-2 mb-10 text-center items-center">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">Rekomendasi Terbaik</span>
        <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink leading-tight">
          Jelajahi Ruang Kerja Pilihan Terbaik Kami <br />Untuk Produktivitas Lebih Maksimal
        </h2>
        <p className="text-xs sm:text-sm text-muted max-w-[500px]">
          Temukan pilihan kantor modern, nyaman, dan strategis dengan penawaran fasilitas terlengkap.
        </p>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isHydrated && offices.map((office) => (
          <OfficeSpaceCard key={office.id} space={office} />
        ))}
      </div>
    </section> 
  );
}

