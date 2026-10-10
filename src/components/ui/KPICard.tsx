import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface KPICardProps {
  label: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  description?: string;
  secondaryMetric?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconColor?: 'emerald' | 'cyan' | 'purple' | 'amber' | 'blue';
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  prefix,
  suffix,
  description,
  secondaryMetric,
  isPositive = true,
  icon: Icon,
  iconColor = 'emerald',
}) => {
  const iconColorStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-cyan-500/10',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-purple-500/10',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/10',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/10',
  }[iconColor];

  return (
    <div className="bg-[#10182A] border border-[#1E2B45] hover:border-[#2B3D60] rounded-2xl p-5 shadow-lg shadow-black/40 transition-all duration-200 hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-[11px] font-semibold text-slate-400 tracking-wide uppercase">
          {label}
        </span>
        <div
          className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 ${iconColorStyles}`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="text-3xl font-extrabold text-white tracking-tight tabular-nums mb-1.5">
        {prefix}
        {typeof value === 'number' ? value.toLocaleString() : value}
        {suffix}
      </div>

      <div className="min-h-[18px] flex items-center">
        {secondaryMetric ? (
          <span
            className={`text-xs font-semibold flex items-center gap-1 ${
              isPositive ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {secondaryMetric}
          </span>
        ) : description ? (
          <span className="text-xs text-slate-400">{description}</span>
        ) : null}
      </div>
    </div>
  );
};
