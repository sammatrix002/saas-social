import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface SidebarNavItemProps {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  isActive: boolean;
  isCollapsed?: boolean;
  onClick: () => void;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  label,
  icon: Icon,
  badge,
  isActive,
  isCollapsed = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group relative ${
        isActive
          ? 'bg-emerald-500 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.35)]'
          : 'text-slate-400 hover:text-white hover:bg-[#10182A]'
      }`}
    >
      <Icon
        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
          isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
        }`}
      />

      {!isCollapsed && (
        <div className="flex-1 flex items-center justify-between text-left truncate">
          <span className="truncate tracking-tight">{label}</span>
          {badge && (
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ml-1.5 shrink-0 ${
                isActive
                  ? 'bg-[#0A1020]/40 text-white border border-white/20'
                  : 'bg-[#10182A] text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {badge}
            </span>
          )}
        </div>
      )}
    </button>
  );
};
