'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { DashboardNavItem, DashboardTheme } from '../types/dashboard.types';

const themeConfig: Record<DashboardTheme, { accent: string; badge: string }> = {
  admin: { accent: '#0D903A', badge: 'Admin' },
  provider: { accent: '#FF852D', badge: 'Provider' },
  customer: { accent: '#0D903A', badge: 'Customer' },
};

interface DashboardShellProps {
  theme: DashboardTheme;
  navItems: DashboardNavItem[];
  children: React.ReactNode;
}

export function DashboardShell({ theme, navItems, children }: DashboardShellProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const config = themeConfig[theme];

  return (
    <div className="min-h-screen flex flex-col bg-canvas">

      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-hairline fixed top-0 left-0 right-0 z-50 premium-transition">
        <div className="flex items-center justify-between w-full max-w-[1130px] py-4 px-4 sm:px-6 xl:px-0 mx-auto">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Image src="/assets/images/logos/logo.svg" alt="logo" width={130} height={35} className="w-auto h-8 object-contain" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-semibold text-muted hover:text-primary transition-colors">HOME</Link>
            <div className="flex items-center gap-2 bg-canvas border border-hairline py-1 px-2.5 rounded-lg">
              <span className="text-xs font-semibold text-ink leading-none">{user?.name}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded-md leading-none" style={{ backgroundColor: config.accent }}>
                {config.badge}
              </span>
            </div>
            <button
              onClick={logout}
              className="rounded-lg border border-danger/20 text-danger hover:bg-danger hover:text-white font-semibold py-1.5 px-3.5 transition-all text-xs cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar & Core Layout */}
      <div className="flex flex-1 w-full max-w-[1130px] mx-auto px-4 sm:px-6 xl:px-0 pt-[73px]">
        
        {/* Sidebar */}
        <aside
          className="bg-white border-r border-hairline fixed left-0 z-40 h-[calc(100vh-73px)] top-[73px] overflow-hidden hover:overflow-y-auto hidden md:block premium-transition"
          style={{ width: '240px' }}
        >
          <nav className="p-4 flex flex-col gap-1.5 h-full overflow-y-auto">
            {navItems.map((item) => {
              const basePath = theme === 'admin' ? '/admin' : theme === 'provider' ? '/provider' : '/customer';
              const isActive = pathname === item.href || (item.href !== basePath && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-xs sm:text-sm tracking-tight premium-transition ${
                    isActive 
                      ? 'bg-primary/10 text-primary border-l-2 border-primary font-semibold shadow-sm' 
                      : 'text-ink/80 hover:bg-canvas'
                  }`}
                  style={{
                    borderLeftColor: isActive ? config.accent : 'transparent',
                    color: isActive ? config.accent : undefined,
                    backgroundColor: isActive ? `${config.accent}12` : undefined
                  }}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Pane */}
        <main 
          className="flex-1 pb-12 transition-all duration-300 md:pl-[260px] pt-6"
        >
          {children}
        </main>

      </div>

    </div>
  );
}