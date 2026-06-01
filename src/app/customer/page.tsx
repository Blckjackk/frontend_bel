'use client';

import { useAuth } from '@/src/features/auth/context/AuthContext';

export default function CustomerDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen py-8">
      <div className="w-full px-4">
        <div className="bg-white border border-[#E0DEF7] rounded-[20px] p-12 text-center">
          <h2 className="font-bold text-4xl mb-3">Selamat datang, {user?.name ?? 'Customer'}</h2>
          <p className="text-lg opacity-60">{user?.email}</p>
          <p className="text-base font-semibold text-[#0D903A] mt-6">{user?.role ?? 'user'}</p>
        </div>
      </div>
    </div>
  );
}