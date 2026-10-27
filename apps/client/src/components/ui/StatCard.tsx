import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon?: LucideIcon;
  image?: string;
  label: string;
  value: string;
  iconClassName?: string;
}

export function StatCard({
  icon: Icon,
  image,
  label,
  value,
  iconClassName = 'bg-blue-50 text-blue-600',
}: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
      {image ? (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg overflow-hidden">
          <img src={image} alt={label} className="h-full w-full object-contain" />
        </span>
      ) : Icon ? (
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}
        >
          <Icon size={18} />
        </span>
      ) : null}
      <div>
        <p className="text-lg font-semibold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}
