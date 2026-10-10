import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Building2, Plus } from 'lucide-react';
import { TenantWorkspace } from '../../types.ts';

interface TenantSelectorProps {
  workspaces: TenantWorkspace[];
  currentWorkspace: TenantWorkspace;
  onSelectWorkspace: (ws: TenantWorkspace) => void;
  onNewWorkspace?: () => void;
}

export const TenantSelector: React.FC<TenantSelectorProps> = ({
  workspaces,
  currentWorkspace,
  onSelectWorkspace,
  onNewWorkspace,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0A1020] hover:bg-[#10182A] border border-[#1E2B45] text-left transition-all text-xs group"
      >
        <div className="w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
          <Building2 className="w-3 h-3" />
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-semibold text-white truncate max-w-[150px]">
            {currentWorkspace.name}
          </span>
          <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/15 px-1.5 py-0.2 rounded border border-emerald-500/30">
            ({currentWorkspace.planId?.replace('plan-', '') || 'pro'})
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-64 bg-[#10182A] border border-[#1E2B45] rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in-50 zoom-in-95">
          <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Switch Workspace
          </div>
          <div className="space-y-0.5 mt-1">
            {workspaces.map((ws) => {
              const isSelected = ws.id === currentWorkspace.id;
              return (
                <button
                  key={ws.id}
                  onClick={() => {
                    onSelectWorkspace(ws);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/25'
                      : 'text-slate-300 hover:bg-[#141E34] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="truncate">{ws.name}</span>
                    <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                      {ws.planId?.replace('plan-', '')}
                    </span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {onNewWorkspace && (
            <div className="pt-1.5 mt-1.5 border-t border-[#1E2B45]">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onNewWorkspace();
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-[#141E34] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Workspace</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
