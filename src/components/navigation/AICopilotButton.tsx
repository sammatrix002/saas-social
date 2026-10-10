import React from 'react';
import { Sparkles } from 'lucide-react';

interface AICopilotButtonProps {
  creditCount?: number;
  onClick: () => void;
}

export const AICopilotButton: React.FC<AICopilotButtonProps> = ({
  creditCount = 980,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/35 text-purple-200 text-xs font-semibold shadow-sm hover:shadow-purple-500/15 transition-all group active:scale-95"
      title="Open Autonomous Platform AI Copilot"
    >
      <div className="w-4 h-4 rounded-md bg-purple-500/20 flex items-center justify-center text-purple-300 group-hover:rotate-12 transition-transform">
        <Sparkles className="w-3 h-3 text-purple-300" />
      </div>
      <span className="font-bold tracking-tight">AI Copilot</span>
      <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
        {creditCount}
      </span>
    </button>
  );
};
