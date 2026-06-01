import Image from "next/image";
import { City } from "@/src/features/cities/types/city.types";
import Link from "next/link";

export default function CityCard({ city }: { city: City }) {
  return (
    <Link 
      href={`/city/${city.slug}`} 
      className="relative flex shrink-0 w-[220px] h-[280px] sm:w-[240px] sm:h-[310px] rounded-xl overflow-hidden select-none border border-hairline bg-white group shadow-sm premium-transition" 
      draggable="false"
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent z-10 pointer-events-none rounded-xl premium-transition group-hover:via-ink/50"></div>
      
      {/* Content Container */}
      <div className="relative flex flex-col justify-end w-full h-full p-5 gap-1.5 z-20 pointer-events-none">
        <h3 className="font-semibold text-lg sm:text-xl tracking-tight text-white leading-snug">
          {city.name}
        </h3>
        <p className="text-[10px] sm:text-xs text-white/80 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-md w-fit font-medium border border-white/10">
          {city.officeCount} Ruangan
        </p>
      </div>

      {/* Background Image with Hover Scale */}
      <Image
        width={240}
        height={310}
        src={city.image}
        className="absolute w-full h-full object-cover rounded-xl transition-transform duration-500 ease-out group-hover:scale-105"
        alt={city.name}
        draggable="false"
      />
    </Link>
  );
}