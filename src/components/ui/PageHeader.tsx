import React from 'react';
import { Plus, LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgePulse?: boolean;
  ctaText?: string;
  ctaIcon?: LucideIcon;
  onCtaClick?: () => void;
  secondaryActions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badgeText,
  badgePulse = true,
  ctaText,
  ctaIcon: CtaIcon = Plus,
  onCtaClick,
  secondaryActions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {title}
          </h1>
          {badgeText && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#0A1020] border border-emerald-500/25 text-emerald-400 font-mono text-[11px] font-semibold">
              {badgePulse && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
              <span>{badgeText}</span>
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto">
        {secondaryActions}
        {ctaText && onCtaClick && (
          <button
            onClick={onCtaClick}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.45)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <CtaIcon className="w-4 h-4" />
            <span>{ctaText}</span>
          </button>
        )}
      </div>
    </div>
  );
};
