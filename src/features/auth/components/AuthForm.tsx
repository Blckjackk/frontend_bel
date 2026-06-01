'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth.types';
import { getRedirectPath } from '../utils/redirect';

type AuthMode = 'login' | 'register';

export default function AuthForm() {
  const router = useRouter();
  const { login, register, isLoading } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'customer' satisfies UserRole
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      let loggedInUser;

      if (mode === 'login') {
        loggedInUser = await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        if (!formData.name) {
          setError('Nama harus diisi');
          setIsSubmitting(false);
          return;
        }

        loggedInUser = await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: formData.role as UserRole,
        });
      }

      router.replace(getRedirectPath(loggedInUser.role));
      setIsSubmitting(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-canvas p-4">
      <div className="bg-white rounded-xl border border-hairline p-6 sm:p-8 w-full max-w-[400px] shadow-sm flex flex-col gap-6 premium-transition">
        
        {/* Toggle Mode Tabs */}
        <div className="flex gap-1.5 p-1 bg-canvas border border-hairline rounded-lg">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              mode === 'login'
                ? 'bg-primary text-white shadow-sm'
                : 'text-ink/70 hover:text-ink hover:bg-ink/5'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              mode === 'register'
                ? 'bg-primary text-white shadow-sm'
                : 'text-ink/70 hover:text-ink hover:bg-ink/5'
            }`}
          >
            Daftar
          </button>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-xl sm:text-2xl text-ink tracking-tight">
            {mode === 'login' ? 'Masuk ke Akun' : 'Buat Akun Baru'}
          </h2>
          <p className="text-xs text-muted">
            {mode === 'login' ? 'Silakan masuk menggunakan kredensial Anda.' : 'Daftar sebagai customer atau penyedia kantor.'}
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-danger/10 border border-danger/25 text-danger p-3.5 rounded-lg text-xs font-semibold leading-relaxed">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Name Field (Register only) */}
          {mode === 'register' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-ink/80 block">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nama lengkap Anda"
                className="w-full px-4 py-2.5 rounded-lg border border-hairline bg-canvas focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted placeholder:font-normal text-sm text-ink premium-transition"
                required={mode === 'register'}
              />
            </div>
          )}

          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-ink/80 block">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="nama@email.com"
              className="w-full px-4 py-2.5 rounded-lg border border-hairline bg-canvas focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted placeholder:font-normal text-sm text-ink premium-transition"
              required
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-ink/80 block">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-hairline bg-canvas focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted placeholder:font-normal text-sm text-ink premium-transition"
              required
            />
          </div>

          {/* Role Field (Register only) */}
          {mode === 'register' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-ink/80 block">
                Pilih Role Akun
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-hairline bg-canvas focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm text-ink appearance-none cursor-pointer premium-transition"
              >
                <option value="customer">Customer (Penyewa Kantor)</option>
                <option value="provider">Office Provider (Penyedia Kantor)</option>
                <option value="admin">Admin System</option>
              </select>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="w-full bg-primary hover:bg-primary-active text-white font-bold py-3 px-4 rounded-lg mt-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm premium-transition cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading || isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Memproses...</span>
              </>
            ) : mode === 'login' ? (
              'Masuk'
            ) : (
              'Buat Akun'
            )}
          </button>
        </form>

      </div>
    </div>
  );
}