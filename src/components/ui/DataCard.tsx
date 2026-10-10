import React from 'react';

interface DataCardProps {
  title?: string;
  badge?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const DataCard: React.FC<DataCardProps> = ({
  title,
  badge,
  actions,
  children,
  className = '',
  noPadding = false,
}) => {
  return (
    <div
      className={`bg-[#10182A] border border-[#1E2B45] rounded-2xl shadow-xl shadow-black/30 overflow-hidden ${className}`}
    >
      {(title || badge || actions) && (
        <div className="px-5 py-4 border-b border-[#1E2B45] flex flex-wrap items-center justify-between gap-3 bg-[#0A1020]/60">
          <div className="flex items-center gap-2.5">
            {title && <h2 className="text-sm font-bold text-white tracking-wide">{title}</h2>}
            {badge && (
              <span className="text-xs px-2.5 py-0.5 rounded-lg bg-[#070B14] text-slate-300 border border-[#1E2B45] font-semibold">
                {badge}
              </span>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
};
