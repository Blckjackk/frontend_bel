'use client';

import { useEffect, useState } from 'react';
import { RoleBadge } from '@/src/features/dashboard/components/StatusBadge';
import { dashboardService } from '@/src/features/dashboard/services/dashboard.service';
import { DashboardUser } from '@/src/features/dashboard/types/dashboard.types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchUsers = () => {
    dashboardService.getUsers()
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId: number, role: string) => {
    setUpdating(userId);
    await dashboardService.updateUserRole(userId, role);
    fetchUsers();
    setUpdating(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#0D903A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white border border-[#E0DEF7] rounded-[20px] p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="font-bold text-lg text-[#000929]">Semua Pengguna ({users.length})</h2>
        </div>

        {users.length === 0 ? (
          <p className="text-sm opacity-50 text-center py-12">Belum ada pengguna terdaftar.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E0DEF7] text-left opacity-60">
                <th className="pb-3 font-medium">Nama</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Bergabung</th>
                <th className="pb-3 font-medium">Ubah Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-[#F7F7FD]">
                  <td className="py-4 font-semibold">{u.name}</td>
                  <td className="py-4 opacity-70">{u.email}</td>
                  <td className="py-4"><RoleBadge role={u.role} /></td>
                  <td className="py-4 opacity-70">
                    {new Date(u.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-4">
                    <select
                      value={u.role}
                      disabled={updating === u.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="border border-[#E0DEF7] rounded-full px-3 py-1.5 text-sm bg-[#F7F7FD] focus:outline-none focus:border-[#0D903A]"
                    >
                      <option value="customer">Customer</option>
                      <option value="provider">Provider</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
