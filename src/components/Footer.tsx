import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-hairline pt-16 pb-12 mt-auto">
      <div className="max-w-[1130px] mx-auto px-4 sm:px-6 xl:px-0 grid grid-cols-1 md:grid-cols-5 gap-10">
        
        {/* Brand Column */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <Link href="/">
            <Image 
              src="/assets/images/logos/logo.svg" 
              alt="logo" 
              width={130} 
              height={35} 
              className="w-auto h-8 object-contain"
            />
          </Link>
          <p className="text-xs text-muted leading-relaxed max-w-[280px]">
            Platform terpercaya untuk mencari ruang kantor idaman di berbagai wilayah strategis Indonesia. Tumbuhkan bisnis Anda bersama kami.
          </p>
          <div className="text-[10px] text-muted-soft mt-2">
            © {new Date().getFullYear()} OfficeHub. All rights reserved.
          </div>
        </div>

        {/* Column 1 */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink">Browse</h4>
          <ul className="flex flex-col gap-2 text-xs text-muted">
            <li><Link href="/popular" className="hover:text-primary transition-colors">Popular Offices</Link></li>
            <li><Link href="/search-city" className="hover:text-primary transition-colors">Search by City</Link></li>
            <li><Link href="/?#Fresh-Space" className="hover:text-primary transition-colors">New Spaces</Link></li>
            <li><Link href="/?#Benefits" className="hover:text-primary transition-colors">Why OfficeHub</Link></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink">Perusahaan</h4>
          <ul className="flex flex-col gap-2 text-xs text-muted">
            <li><Link href="#" className="hover:text-primary transition-colors">Tentang Kami</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Karir</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Hubungi Sales</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Bantuan</Link></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink">Bagi Provider</h4>
          <ul className="flex flex-col gap-2 text-xs text-muted">
            <li><Link href="/auth/login" className="hover:text-primary transition-colors">Daftar Akun</Link></li>
            <li><Link href="/auth/login" className="hover:text-primary transition-colors">Kelola Ruangan</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Kebijakan Layanan</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link></li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
