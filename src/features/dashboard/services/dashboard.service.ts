import { DashboardBooking, DashboardUser } from '../types/dashboard.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`);
  const data = await res.json();
  if (data?.error) throw new Error(data.error);
  return data;
}

export const dashboardService = {
  getUsers: () => fetchApi<DashboardUser[]>('/users'),
  getAllBookings: () => fetchApi<DashboardBooking[]>('/bookings/all'),
  updateBookingStatus: (id: number, status: string) =>
    fetch(`${API_URL}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then((r) => r.json()),
  updateUserRole: (id: number, role: string) =>
    fetch(`${API_URL}/users/${id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    }).then((r) => r.json()),
};
