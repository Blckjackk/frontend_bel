'use client';

import { useRoleGuard } from '@/src/features/dashboard/hooks/useRoleGuard';
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell';
import { providerNavItems } from '@/src/features/dashboard/config/nav.config';

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthorized } = useRoleGuard('office_provider');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#FF852D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <DashboardShell theme="provider" navItems={providerNavItems}>
      {children}
    </DashboardShell>
  );
}
