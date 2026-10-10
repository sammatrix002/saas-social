import React from 'react';

interface PlatformBadgeProps {
  platform: 'facebook' | 'instagram' | 'both' | 'whatsapp' | 'telegram' | 'tiktok' | 'linkedin' | string;
}

export const PlatformBadge: React.FC<PlatformBadgeProps> = ({ platform }) => {
  const norm = platform.toLowerCase();

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
  let label = platform;

  if (norm === 'both') {
    colorClasses = 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
    label = 'Both';
  } else if (norm === 'facebook') {
    colorClasses = 'bg-blue-500/10 text-blue-300 border-blue-500/20';
    label = 'Facebook';
  } else if (norm === 'instagram') {
    colorClasses = 'bg-pink-500/10 text-pink-300 border-pink-500/20';
    label = 'Instagram';
  } else if (norm === 'whatsapp' || norm === 'whatsapp_cloud') {
    colorClasses = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
    label = 'WhatsApp';
  } else if (norm === 'telegram') {
    colorClasses = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
    label = 'Telegram';
  } else if (norm === 'tiktok') {
    colorClasses = 'bg-neutral-800 text-neutral-200 border-neutral-700';
    label = 'TikTok';
  } else if (norm === 'linkedin') {
    colorClasses = 'bg-sky-500/10 text-sky-300 border-sky-500/20';
    label = 'LinkedIn';
  }

  return (
    <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded border capitalize ${colorClasses}`}>
      {label}
    </span>
  );
};
