export type UserRole = 'admin' | 'provider' | 'customer';

export interface User {
  id: string;
  email: string; 
  name: string;
  role: UserRole;
  createdAt: Date;
}

export interface LoginRequest { 
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<User>;
  register: (data: RegisterRequest) => Promise<User>;
  logout: () => void;
}
