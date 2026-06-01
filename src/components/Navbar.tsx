'use client';

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/src/features/auth/context/AuthContext";
import { getChatPath } from "@/src/features/auth/utils/redirect";

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';

  const handleRoleClick = () => {
    if (user?.role === 'admin') {
      router.push('/admin');
    } else if (user?.role === 'provider') {
      router.push('/provider');
    } else if (user?.role === 'customer') {
      router.push('/customer');
    }
  };

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-hairline sticky top-0 z-50 premium-transition">
      <div className="flex items-center justify-between w-full max-w-[1130px] py-4 px-4 sm:px-6 xl:px-0 mx-auto">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <Image src="/assets/images/logos/logo.svg" alt="logo" width={140} height={40} className="w-auto h-8 sm:h-9 object-contain" />
        </Link>
        
        <ul className="hidden md:flex items-center gap-8 w-fit text-sm font-medium text-ink/80">
          {!isHome && (
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
          )}
          <li>
            <Link href="/popular" className="hover:text-primary transition-colors">
              Popular
            </Link>
          </li>
          <li>
            <Link href="/search-city" className="hover:text-primary transition-colors">
              Search City
            </Link>
          </li>
          {user && user.role === 'customer' && (
            <li>
              <Link href="/customer/bookings" className="hover:text-primary transition-colors">
                My Booking
              </Link>
            </li>
          )}
          <li>
            <Link href={user ? getChatPath(user.role) : '/auth/login'} className="hover:text-primary transition-colors">
              Chat
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-3 bg-canvas border border-hairline py-1.5 px-3 rounded-lg">
                <span className="text-xs font-semibold text-ink/90">{user.name}</span>
                <button
                  onClick={handleRoleClick}
                  className="text-[10px] uppercase tracking-wider bg-primary hover:bg-primary-active text-white px-3 py-1 rounded-md transition-colors cursor-pointer font-bold"
                >
                  {user.role === 'provider' ? 'Provider' : user.role === 'customer' ? 'Customer' : user.role}
                </button>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-lg border border-danger/20 text-danger hover:bg-danger hover:text-white py-1.5 px-3 text-xs font-semibold transition-all cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              href="/auth/login" 
              className="flex items-center gap-2 rounded-lg border border-ink/20 py-1.5 px-4 hover:border-primary hover:text-primary text-sm font-semibold transition-all"
            >
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;