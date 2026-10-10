import React, { useState, useRef, useEffect } from 'react';
import {
  AppMode,
  TenantWorkspace,
} from '../../types.ts';
import {
  LanguageCode,
  SUPPORTED_LANGUAGES,
} from '../../translations.ts';
import {
  Plus,
  User,
  Shield,
  ExternalLink,
  LogOut,
  Bell,
  CheckCircle2,
  LogIn,
  Key,
} from 'lucide-react';
import { TenantSelector } from './TenantSelector.tsx';
import { AICopilotButton } from './AICopilotButton.tsx';
import { CurrencySelector } from './CurrencySelector.tsx';
import { LanguageSelector } from './LanguageSelector.tsx';

export interface TopNavbarProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  workspaces: TenantWorkspace[];
  currentWorkspace: TenantWorkspace;
  setCurrentWorkspace: (ws: TenantWorkspace) => void;
  currentLang: LanguageCode;
  setCurrentLang: (lang: LanguageCode) => void;
  selectedCurrency: string;
  setSelectedCurrency: (curr: string) => void;
  currencies: { code: string; symbol: string }[];
  onOpenCopilot: () => void;
  onOpenChannelConnector?: () => void;
  onOpenAuthModal?: (role?: 'admin' | 'tenant') => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  mode,
  setMode,
  workspaces,
  currentWorkspace,
  setCurrentWorkspace,
  currentLang,
  setCurrentLang,
  selectedCurrency,
  setSelectedCurrency,
  currencies,
  onOpenCopilot,
  onOpenChannelConnector,
  onOpenAuthModal,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navTabs: { id: AppMode; label: string }[] = [
    { id: 'landing', label: 'Landing' },
    { id: 'tenant', label: 'Tenant Workspace' },
    { id: 'superadmin', label: 'Super Admin' },
    { id: 'booking', label: 'Booking Portal' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#0A1020]/95 backdrop-blur-md border-b border-[#1E2B45] select-none shrink-0 px-4 lg:px-6 flex items-center justify-between gap-3">
      {/* Left: Brand & Logo */}
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={() => setMode('landing')}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <div className="w-8 h-8 relative flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 36 36" className="w-8 h-8 drop-shadow-[0_0_10px_rgba(16,185,129,0.55)]">
              <polygon points="18,2 32,10 32,26 18,34 4,26 4,10" fill="#10B981" />
              <path d="M10,13 L13.5,23 L18,15 L22.5,23 L26,13" fill="none" stroke="#070B14" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg text-white tracking-tight">WhatsOmni</span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
              v3.0
            </span>
          </div>
        </button>

        {/* Navigation Mode Switcher */}
        <nav className="hidden md:flex items-center gap-1 pl-3 border-l border-[#1E2B45]">
          {navTabs.map((tab) => {
            const isActive = mode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setMode(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#10182A] text-white border border-[#1E2B45] shadow-sm font-bold text-emerald-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#10182A]/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Center: Tenant Workspace Selector (Visible in Tenant Mode) */}
      <div className="hidden xl:flex items-center">
        <TenantSelector
          workspaces={workspaces}
          currentWorkspace={currentWorkspace}
          onSelectWorkspace={setCurrentWorkspace}
        />
      </div>

      {/* Right: Actions, AI Copilot, Currency, Language, User Menu */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Connect Channel Button */}
        {onOpenChannelConnector && (
          <button
            onClick={onOpenChannelConnector}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A1020] hover:bg-[#10182A] border border-[#1E2B45] text-slate-300 hover:text-white text-xs font-semibold transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Connect Channel</span>
          </button>
        )}

        {/* AI Copilot Button with remaining credit indicator */}
        <AICopilotButton
          creditCount={currentWorkspace.copilotCreditsRemaining || 980}
          onClick={onOpenCopilot}
        />

        {/* Currency Selector */}
        <CurrencySelector
          selectedCurrency={selectedCurrency}
          onSelectCurrency={setSelectedCurrency}
          currencies={currencies}
        />

        {/* Language Selector */}
        <LanguageSelector
          currentLang={currentLang}
          onSelectLang={setCurrentLang}
        />

        {/* User / Demo Account Controls */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0A1020] hover:bg-[#10182A] border border-[#1E2B45] text-left transition-all"
            title="User Profile & Quick Auth"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
              AM
            </div>
            <div className="hidden lg:block text-left text-xs pr-1">
              <div className="font-bold text-white text-[11px] leading-tight">Alex Mercer</div>
              <div className="text-[10px] text-emerald-400">Account Owner</div>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-[#10182A] border border-[#1E2B45] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in-50 zoom-in-95">
              <div className="p-2 border-b border-[#1E2B45] mb-1">
                <div className="font-bold text-white text-xs">Alex Mercer</div>
                <div className="text-[11px] text-slate-400">demo@whatsomni.com</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-emerald-400 font-semibold font-mono">
                    Workspace: {currentWorkspace.name}
                  </span>
                </div>
              </div>

              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setMode('superadmin');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-[#141E34] transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span>Super Admin Control Plane</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenAuthModal?.('admin');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-[#141E34] transition-colors"
                >
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Switch User / OTP Login</span>
                </button>
              </div>

              <div className="pt-1 mt-1 border-t border-[#1E2B45]">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setMode('landing');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out / Landing View</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
