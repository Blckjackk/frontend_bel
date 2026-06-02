import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const SERVER_DOWN_MSG =
  'Server backend tidak berjalan. Jalankan: php artisan serve';

async function parseAuthResponse(res: Response): Promise<AuthResponse> {
  if (!res.ok) {
    return { success: false, message: SERVER_DOWN_MSG };
  }

  const result = await res.json();

  if (result.message === 'Invalid credentials') {
    return { success: false, message: 'Email atau password salah' };
  }

  if (!result.user || !result.token) {
    return { success: false, message: result.message || 'Login gagal' };
  }

  return {
    success: true,
    message: 'Login berhasil',
    user: {
      id: String(result.user.id),
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
      createdAt: new Date(),
    },
    token: result.token,
  };
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await parseAuthResponse(res);
    } catch {
      return { success: false, message: SERVER_DOWN_MSG };
    }
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        return { success: false, message: SERVER_DOWN_MSG };
      }

      const result = await res.json();

      if (result.message === 'Email already exists') {
        return { success: false, message: 'Email sudah terdaftar' };
      }

      return await authService.login({ email: data.email, password: data.password });
    } catch {
      return { success: false, message: SERVER_DOWN_MSG };
    }
  },
};
