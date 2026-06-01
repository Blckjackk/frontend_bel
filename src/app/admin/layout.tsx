'use client';

import { useRoleGuard } from '@/src/features/dashboard/hooks/useRoleGuard';
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell';
import { adminNavItems } from '@/src/features/dashboard/config/nav.config';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthorized } = useRoleGuard('admin');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#0D903A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <DashboardShell theme="admin" navItems={adminNavItems}>
      {children}
    </DashboardShell>
  );
}
