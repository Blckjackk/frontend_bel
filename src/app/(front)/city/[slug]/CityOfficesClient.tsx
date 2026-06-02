'use client';

import { useMemo, useState, useEffect } from 'react';
import OfficeSpaceCard from '@/src/features/offices/components/OfficeSpaceCard';
import type { OfficeSpace } from '@/src/features/offices/types/officeSpace.types';
import { mapOfficeDtoToOfficeSpace } from '@/src/features/offices/types/officeSpace.types';

export default function CityOfficesClient({ cityName }: { cityName: string }) {
  const [offices, setOffices] = useState<OfficeSpace[]>([]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    fetch(`${apiUrl}/offices`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOffices(data.map(mapOfficeDtoToOfficeSpace));
        }
      })
      .catch((err) => console.error("Error fetching offices:", err));
  }, []);

  const cityOffices = useMemo(() => offices.filter((o) => o.location.toLowerCase() === cityName.toLowerCase()), [offices, cityName]);

  return (
    <div className="grid grid-cols-3 gap-[30px]">
      {cityOffices.length > 0 ? (
        cityOffices.map((space) => <OfficeSpaceCard key={space.id} space={space} />)
      ) : (
        <p className="text-lg leading-8 text-[#000929]">
          No office spaces available in {cityName} at the moment. Please check back later.
        </p>
      )}
    </div>
  );
}

