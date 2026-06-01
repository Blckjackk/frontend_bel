'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User, LoginRequest, RegisterRequest } from '../types/auth.types';
import { authService } from '../services/auth.service';

const normalizeRole = (role: string): User['role'] => {
  if (role === 'user') return 'customer';
  if (role === 'office_provider') return 'provider';
  if (role === 'admin' || role === 'provider' || role === 'customer') return role;
  return 'customer';
};

const parseStoredUser = (raw: string): User | null => {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.email) return null;
    return { ...parsed, role: normalizeRole(parsed.role ?? 'user') };
  } catch {
    return null;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const safeLocalStorage = {
  getItem: (key: string) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {}
  },
  removeItem: (key: string) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {}
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from localStorage
  useEffect(() => {
    const savedUser = safeLocalStorage.getItem('user');
    const savedToken = safeLocalStorage.getItem('token');
    if (savedUser && savedToken) {
      const parsed = parseStoredUser(savedUser);
      if (parsed) {
        setUser(parsed);
      } else {
        safeLocalStorage.removeItem('user');
        safeLocalStorage.removeItem('token');
      }
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistUser = (responseUser: User, token: string): User => {
    const normalizedUser = { ...responseUser, role: normalizeRole(responseUser.role) };
    setUser(normalizedUser);
    safeLocalStorage.setItem('user', JSON.stringify(normalizedUser));
    safeLocalStorage.setItem('token', token);
    return normalizedUser;
  };

  const login = async (data: LoginRequest): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      if (!response.success) throw new Error(response.message);
      if (!response.user || !response.token) {
        throw new Error('Login gagal. Coba lagi.');
      }
      return persistUser(response.user, response.token);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      if (!response.success) throw new Error(response.message);
      if (!response.user || !response.token) {
        throw new Error('Registrasi gagal. Coba lagi.');
      }
      return persistUser(response.user, response.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    safeLocalStorage.removeItem('user');
    safeLocalStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
}