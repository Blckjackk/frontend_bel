"use client";

import Link from "next/link";
import { OfficeSpace } from "../types/officeSpace.types";
import Image from "next/image";

export default function OfficeSpaceCard({ space }: { space: OfficeSpace }) {
  return (
    <Link href={`/office/${space.slug}`} className="group">
      <div className="flex flex-col rounded-xl border border-hairline bg-white overflow-hidden shadow-sm premium-transition hover:border-primary/40 hover:-translate-y-1 h-full">
        
        {/* Image Container with Badges */}
        <div className="relative w-full h-[200px] bg-canvas overflow-hidden">
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
            {space.tags.map((tag) => (
              <p
                key={tag}
                className="w-fit rounded-md p-[4px_10px] bg-primary font-bold text-[10px] uppercase tracking-wider text-white shadow-sm"
              >
                {tag}
              </p>
            ))}
          </div>
          <Image
            src={space.image}
            alt={space.title}
            width={400}
            height={200}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-103"
          />
        </div>

        {/* Details Container */}
        <div className="flex flex-col p-5 gap-3.5 flex-1">
          <h3 className="font-semibold text-base sm:text-lg text-ink tracking-tight hover:text-primary transition-colors line-clamp-1 leading-snug">
            {space.title}
          </h3>

          <div className="flex items-center justify-between">
            <p className="font-bold text-base sm:text-lg text-primary">
              Rp {space.price.toLocaleString('id')}
            </p>
            <div className="flex items-center gap-1.5 bg-canvas border border-hairline py-1 px-2.5 rounded-md">
              <span className="text-[10px] sm:text-xs font-semibold text-ink/80">{space.duration}</span>
              <Image src="/assets/images/icons/clock.svg" className="w-3.5 h-3.5 opacity-80" alt="clock icon" width={14} height={14} />
            </div>
          </div>

          <hr className="border-hairline" />

          {/* Location & Rating */}
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <div className="flex items-center gap-1.5">
              <Image src="/assets/images/icons/location.svg" className="w-4 h-4 opacity-75" alt="location icon" width={16} height={16} />
              <p className="line-clamp-1">{space.location}</p>
            </div>
            <div className="flex items-center gap-1 font-bold text-ink">
              <p>{space.rating}/5</p>
              <Image src="/assets/images/icons/Star 1.svg" className="w-3.5 h-3.5" alt="star icon" width={14} height={14} />
            </div>
          </div>

          <hr className="border-hairline" />

          {/* Features Checklist */}
          <div className="flex items-center justify-between text-xs font-medium text-muted mt-auto pt-1">
            <div className="flex items-center gap-1.5">
              <Image src="/assets/images/icons/wifi.svg" className="w-4 h-4 opacity-75" alt="wifi icon" width={16} height={16} />
              <p className="line-clamp-1">{space.features[0] || 'Fast WiFi'}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Image src="/assets/images/icons/security-user.svg" className="w-4 h-4 opacity-75" alt="security icon" width={16} height={16} />
              <p className="line-clamp-1">{space.features[1] || 'Security'}</p>
            </div>
          </div>

        </div>

      </div>
    </Link>
  );
}