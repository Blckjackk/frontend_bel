interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  accent?: string;
}

export function StatCard({ label, value, icon, accent = '#0D903A' }: StatCardProps) {
  return (
    <div className="bg-white border border-hairline rounded-xl p-5 flex items-center gap-4 shadow-sm premium-transition hover:border-primary/30">
      {/* Icon frame container */}
      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center text-lg shrink-0 border border-hairline bg-canvas"
      >
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-[11px] sm:text-xs text-muted font-semibold uppercase tracking-wider">{label}</p>
        <p className="font-bold text-xl sm:text-2xl text-ink tracking-tight">{value}</p>
      </div>
    </div>
  );
}

