'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import NavbarWrapper from "@/src/components/NavbarWrapper";
import OfficeSpaceCard from "@/src/features/offices/components/OfficeSpaceCard";
import type { OfficeSpace } from "@/src/features/offices/types/officeSpace.types";
import { getAllOffices } from "@/src/features/offices/store/providerOffices.store";

const popularCities = ["Jakarta", "Surabaya", "Bandung", "Medan", "Bali"];

export default function SearchCityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<OfficeSpace[]>([]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const filtered = getAllOffices().filter((office) =>
      office.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setResults(filtered);
    setSearched(true);
    setSubmittedQuery(searchQuery);
  };

  const handleCityClick = (city: string) => {
    setSearchQuery(city);
    const filtered = getAllOffices().filter((office) =>
      office.location.toLowerCase().includes(city.toLowerCase())
    );
    setResults(filtered);
    setSearched(true);
    setSubmittedQuery(city);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7FD]" suppressHydrationWarning>
      <NavbarWrapper />

      <div
        className="w-full max-w-[1130px] mx-auto px-6 flex flex-col gap-10"
        style={{ paddingTop: '60px', paddingBottom: '80px' }}
      >
        {/* Heading */}
        <div className="flex flex-col gap-3">
          <h1 className="font-extrabold text-[42px] leading-[52px] text-[#000929]">
            Cari Kantor di <span className="text-[#0D903A]">Kotamu</span>
          </h1>
          <p className="text-[#666] text-lg">Temukan ruang kerja terbaik di seluruh Indonesia</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-3 w-full">
          <div
            className="flex-1 flex items-center gap-3 bg-white border border-[#E0DEF7] px-5 py-4 shadow-sm"
            style={{ borderRadius: '999px' }}
          >
            <svg className="w-5 h-5 text-[#0D903A] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              placeholder="Ketik nama kota..."
              className="flex-1 bg-transparent outline-none text-[#000929] placeholder-gray-300 text-base"
              suppressHydrationWarning
            />
          </div>
          <button
            type="submit"
            style={{ borderRadius: '999px', padding: '16px 40px', background: '#0D903A', color: 'white', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}
          >
            Cari
          </button>
        </form>

        {/* Popular Cities */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-[#999] font-medium">Populer:</span>
          {popularCities.map((city) => (
            <button
              key={city}
              onClick={() => handleCityClick(city)}
              style={{ borderRadius: '999px', padding: '8px 20px', border: '1px solid #E0DEF7', background: 'white', fontSize: '14px', fontWeight: '600', color: '#000929', cursor: 'pointer' }}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Results */}
        {searched && (
          results.length > 0 ? (
            <div className="flex flex-col gap-6">
              <h2 className="font-bold text-[22px] text-[#000929]">
                <span className="text-[#0D903A]">{results.length} kantor</span> ditemukan di &quot;{submittedQuery}&quot;
              </h2>
              <div className="grid grid-cols-3 gap-[30px]">
                {results.map((office) => (
                  <OfficeSpaceCard key={office.id} space={office} />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-white border border-[#E0DEF7] flex items-center justify-center text-3xl shadow-sm">🏙️</div>
              <p className="text-xl font-semibold text-[#000929]">Tidak ada kantor di &quot;{submittedQuery}&quot;</p>
              <p className="text-[#999] text-sm">Coba kota lain seperti Jakarta atau Surabaya</p>
            </div>
          )
        )}

        {!searched && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#E0DEF7] flex items-center justify-center text-3xl shadow-sm">🗺️</div>
            <p className="font-semibold text-[#000929]">Mulai pencarian kotamu</p>
            <p className="text-sm text-[#999]">Ketik nama kota di atas atau pilih dari daftar populer</p>
          </div>
        )}
      </div>
    </div>
  );
}