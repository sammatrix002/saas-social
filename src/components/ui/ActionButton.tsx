import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  label?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'amber' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'icon';
  title?: string;
  disabled?: boolean;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  icon: Icon,
  onClick,
  variant = 'secondary',
  size = 'md',
  title,
  disabled = false,
  className = '',
}) => {
  const variantStyles = {
    primary:
      'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)] border-transparent',
    secondary:
      'bg-[#0A1020] hover:bg-[#141E34] text-slate-300 hover:text-white border-[#1E2B45]',
    amber:
      'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/25',
    danger:
      'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/25',
    ghost:
      'bg-transparent hover:bg-[#141E34] text-slate-400 hover:text-white border-transparent',
  }[variant];

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs rounded-lg gap-1.5',
    md: 'px-3.5 py-2 text-xs font-semibold rounded-xl gap-2',
    icon: 'p-2 rounded-lg',
  }[size];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center justify-center font-medium border transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${variantStyles} ${sizeStyles} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label && <span>{label}</span>}
    </button>
  );
};
