import React from 'react';

interface StatusBadgeProps {
  status: 'active' | 'paused' | 'pending' | 'resolved' | 'open' | 'connected' | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const norm = status.toLowerCase();

  if (norm === 'active' || norm === 'connected' || norm === 'resolved') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 ${
          size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>{status}</span>
      </span>
    );
  }

  if (norm === 'paused' || norm === 'disabled') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/60 ${
          size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
        <span>{status}</span>
      </span>
    );
  }

  if (norm === 'pending') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25 ${
          size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <span>{status}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full bg-slate-800 text-slate-300 border border-slate-700 ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span>{status}</span>
    </span>
  );
};
