'use client';

import { useMemo, useState } from 'react';
import OfficeSpaceCard from '@/src/features/offices/components/OfficeSpaceCard';
import type { OfficeSpace } from '@/src/features/offices/types/officeSpace.types';
import { getAllOffices } from '@/src/features/offices/store/providerOffices.store';

export default function PopularClient() {
  const [offices] = useState<OfficeSpace[]>(() => getAllOffices());

  const popular = useMemo(() => offices.filter((o) => o.tags?.includes('Popular')), [offices]);

  return popular.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-xl text-[#999999]">No offices found</p>
    </div>
  ) : (
    <div className="grid grid-cols-3 gap-[30px]">
      {popular.map((office) => (
        <OfficeSpaceCard key={office.id} space={office} />
      ))}
    </div>
  );
}

