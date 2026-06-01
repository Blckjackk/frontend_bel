export interface DashboardUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface DashboardBooking {
  id: number;
  booking_trx_id?: string;
  user_id: number;
  office_id: number;
  office_title?: string;  // legacy field - may not exist in API
  office_slug?: string;
  price: number;
  duration: string;
  status: string;
  created_at: string;
  user?: { id: number; name: string; email: string };
  office?: { id: number; name: string; slug?: string; city?: { name: string } };
  transactions?: any[];
}

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: string;
}

export type DashboardTheme = 'admin' | 'provider' | 'customer';
