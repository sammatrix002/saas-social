import { create } from 'zustand';
import {
  AppMode,
  TenantWorkspace,
  ChannelInfo,
  MetaAdCampaign,
} from '../types.ts';
import { LanguageCode } from '../translations.ts';
import {
  INITIAL_TENANTS,
  INITIAL_CHANNELS,
  INITIAL_META_ADS,
  INITIAL_CURRENCIES,
} from '../data/initialData.ts';

interface AppState {
  // Navigation & Mode
  mode: AppMode;
  setMode: (mode: AppMode) => void;

  // Workspaces & Tenancy
  workspaces: TenantWorkspace[];
  currentWorkspace: TenantWorkspace;
  setWorkspaces: (workspaces: TenantWorkspace[]) => void;
  setCurrentWorkspace: (workspace: TenantWorkspace) => void;

  // Localization & Multi-Currency
  currentLang: LanguageCode;
  setCurrentLang: (lang: LanguageCode) => void;
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;

  // Channels
  channels: ChannelInfo[];
  addChannel: (channel: ChannelInfo) => void;

  // Campaigns
  campaigns: MetaAdCampaign[];
  addCampaign: (campaign: MetaAdCampaign) => void;
  toggleCampaignStatus: (id: string) => void;

  // Modals & Drawers UI State
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  isChannelConnectorOpen: boolean;
  setIsChannelConnectorOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalRole: 'admin' | 'tenant';
  setAuthModalRole: (role: 'admin' | 'tenant') => void;

  // Impersonation
  isImpersonating: boolean;
  setIsImpersonating: (val: boolean) => void;

  // Credit Deduction
  deductCopilotCredit: (amount?: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  mode: 'tenant',
  setMode: (mode) => set({ mode }),

  workspaces: INITIAL_TENANTS,
  currentWorkspace: INITIAL_TENANTS[0],
  setWorkspaces: (workspaces) => set({ workspaces }),
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),

  currentLang: 'en',
  setCurrentLang: (lang) => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' || lang === 'he' ? 'rtl' : 'ltr';
    set({ currentLang: lang });
  },

  selectedCurrency: 'USD',
  setSelectedCurrency: (currency) => set({ selectedCurrency: currency }),

  channels: INITIAL_CHANNELS,
  addChannel: (channel) =>
    set((state) => ({ channels: [channel, ...state.channels] })),

  campaigns: INITIAL_META_ADS,
  addCampaign: (campaign) =>
    set((state) => ({ campaigns: [campaign, ...state.campaigns] })),
  toggleCampaignStatus: (id) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c
      ),
    })),

  isCopilotOpen: false,
  setIsCopilotOpen: (isCopilotOpen) => set({ isCopilotOpen }),

  isChannelConnectorOpen: false,
  setIsChannelConnectorOpen: (isChannelConnectorOpen) =>
    set({ isChannelConnectorOpen }),

  isAuthModalOpen: false,
  setIsAuthModalOpen: (isAuthModalOpen) => set({ isAuthModalOpen }),

  authModalRole: 'tenant',
  setAuthModalRole: (authModalRole) => set({ authModalRole }),

  isImpersonating: false,
  setIsImpersonating: (isImpersonating) => set({ isImpersonating }),

  deductCopilotCredit: (amount = 1) =>
    set((state) => ({
      currentWorkspace: {
        ...state.currentWorkspace,
        copilotCreditsRemaining: Math.max(
          0,
          (state.currentWorkspace.copilotCreditsRemaining || 980) - amount
        ),
      },
    })),
}));
