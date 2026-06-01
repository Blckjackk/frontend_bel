import { DashboardNavItem } from '../types/dashboard.types';

export const customerNavItems: DashboardNavItem[] = [
  { label: 'Overview', href: '/customer', icon: '🏠' },
  { label: 'My Bookings', href: '/customer/bookings', icon: '📅' },
  { label: 'Wishlist', href: '/customer/wishlist', icon: '💾' },
  { label: 'Chat', href: '/customer/chat', icon: '💬' },
];

export const adminNavItems: DashboardNavItem[] = [
  { label: 'Overview', href: '/admin', icon: '📊' },
  { label: 'Users', href: '/admin/users', icon: '👥' },
  { label: 'Bookings', href: '/admin/bookings', icon: '📋' },
  { label: 'Chat', href: '/admin/chat', icon: '💬' },
];

export const providerNavItems: DashboardNavItem[] = [
  { label: 'Overview', href: '/provider', icon: '📊' },
  { label: 'Offices', href: '/provider/offices', icon: '🏢' },
  { label: 'Bookings', href: '/provider/bookings', icon: '📅' },
  { label: 'Chat', href: '/provider/chat', icon: '💬' },
];
