const statusStyles: Record<string, string> = {
  pending: 'bg-accent text-white shadow-sm',
  paid: 'bg-blue-500 text-white shadow-sm',
  confirmed: 'bg-primary text-white shadow-sm',
  completed: 'bg-primary text-white shadow-sm',
  cancelled: 'bg-danger text-white shadow-sm',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  paid: 'Waiting Verify',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyles[status] ?? 'bg-accent text-white'}`}
    >
      {statusLabels[status] ?? status}
    </span>
  );
}

export function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin: 'bg-primary text-white shadow-sm',
    provider: 'bg-accent text-white shadow-sm',
    office_provider: 'bg-accent text-white shadow-sm',  // legacy fallback
    customer: 'bg-ink text-white shadow-sm',
    user: 'bg-ink text-white shadow-sm',               // legacy fallback
  };
  const labels: Record<string, string> = {
    admin: 'Admin',
    provider: 'Provider',
    office_provider: 'Provider',
    customer: 'Customer',
    user: 'Customer',
  };
  return (
    <span className={`inline-block rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${styles[role] ?? 'bg-ink text-white shadow-sm'}`}>
      {labels[role] ?? role}
    </span>
  );
}
