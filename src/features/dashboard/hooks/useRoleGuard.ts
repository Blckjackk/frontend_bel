'use client';

import { useAuth } from '@/src/features/auth/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type AllowedRole = 'admin' | 'office_provider' | 'user' | 'provider' | 'customer';

export function useRoleGuard(allowedRole: AllowedRole) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isMatched = user ? (
    user.role === allowedRole ||
    (allowedRole === 'office_provider' && user.role === 'provider') ||
    (allowedRole === 'user' && user.role === 'customer')
  ) : false;

  useEffect(() => {
    if (!mounted || isLoading) return;
    if (!user || !isMatched) {
      router.replace('/auth/login');
    }
  }, [user, isLoading, allowedRole, router, mounted, isMatched]);

  return {
    user,
    isLoading: !mounted || isLoading,
    isAuthorized: mounted && !isLoading && !!user && isMatched,
  };
}
