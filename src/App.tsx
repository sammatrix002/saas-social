/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  AppMode,
  TenantWorkspace,
  ChannelInfo,
  Contact,
  Conversation,
  MetaAdCampaign,
  FlowNode,
  FlowEdge,
  FlowTemplate,
  WhatsAppFlowForm,
  CatalogItem,
  AiChatBot,
  KnowledgeDoc,
  SocialPost,
  BroadcastCampaign,
  CrmDeal,
  StaffMember,
  AbandonedCart,
  PaymentGatewayConfig,
  CurrencyConfig,
  SubscriptionPlan,
  RolePermission,
} from './types.ts';

import {
  INITIAL_CHANNELS,
  INITIAL_CONTACTS,
  INITIAL_CONVERSATIONS,
  INITIAL_META_ADS,
  INITIAL_FLOW_NODES,
  INITIAL_FLOW_EDGES,
  INITIAL_FLOW_TEMPLATES,
  INITIAL_FLOW_FORMS,
  INITIAL_CATALOG_ITEMS,
  INITIAL_CHATBOTS,
  INITIAL_KNOWLEDGE_DOCS,
  INITIAL_SOCIAL_POSTS,
  INITIAL_BROADCASTS,
  INITIAL_DEALS,
  INITIAL_STAFF,
  INITIAL_ABANDONED_CARTS,
  INITIAL_PAYMENT_GATEWAYS,
  INITIAL_CURRENCIES,
  INITIAL_PLANS,
  INITIAL_TENANTS,
  INITIAL_RBAC_PERMISSIONS,
} from './data/initialData.ts';

import { LanguageCode, SUPPORTED_LANGUAGES } from './translations.ts';
import { TopNavbar } from './components/navigation/TopNavbar.tsx';
import { CopilotDrawer } from './components/CopilotDrawer.tsx';
import { LandingPage } from './components/landing/LandingPage.tsx';
import { TenantLayout } from './components/tenant/TenantLayout.tsx';
import { SuperAdminDashboard } from './components/superadmin/SuperAdminDashboard.tsx';
import { PublicBookingPage } from './components/booking/PublicBookingPage.tsx';
import { LiveChatWidget } from './components/common/LiveChatWidget.tsx';
import { ChannelConnectorModal } from './components/common/ChannelConnectorModal.tsx';
import { CheckoutModal } from './components/common/CheckoutModal.tsx';
import { AuthModal } from './components/auth/AuthModal.tsx';
import { apiClient } from './services/apiClient.ts';
import { Shield, LogOut } from 'lucide-react';

export default function App() {
  // Default to tenant mode to immediately showcase the reference dashboard screen
  const [mode, setMode] = useState<AppMode>('tenant');
  const [isImpersonating, setIsImpersonating] = useState(false);

  // Workspaces & Current Tenant
  const [workspaces, setWorkspaces] = useState<TenantWorkspace[]>(INITIAL_TENANTS);
  const [currentWorkspace, setCurrentWorkspace] = useState<TenantWorkspace>(INITIAL_TENANTS[0]);

  // Data states
  const [channels, setChannels] = useState<ChannelInfo[]>(INITIAL_CHANNELS);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [campaigns, setCampaigns] = useState<MetaAdCampaign[]>(INITIAL_META_ADS);
  const [flowNodes, setFlowNodes] = useState<FlowNode[]>(INITIAL_FLOW_NODES);
  const [flowEdges, setFlowEdges] = useState<FlowEdge[]>(INITIAL_FLOW_EDGES);
  const [flowTemplates, setFlowTemplates] = useState<FlowTemplate[]>(INITIAL_FLOW_TEMPLATES);
  const [flowForms, setFlowForms] = useState<WhatsAppFlowForm[]>(INITIAL_FLOW_FORMS);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(INITIAL_CATALOG_ITEMS);
  const [chatbots, setChatbots] = useState<AiChatBot[]>(INITIAL_CHATBOTS);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDoc[]>(INITIAL_KNOWLEDGE_DOCS);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(INITIAL_SOCIAL_POSTS);
  const [broadcasts, setBroadcasts] = useState<BroadcastCampaign[]>(INITIAL_BROADCASTS);
  const [deals, setDeals] = useState<CrmDeal[]>(INITIAL_DEALS);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>(INITIAL_ABANDONED_CARTS);
  const [paymentGateways, setPaymentGateways] = useState<PaymentGatewayConfig[]>(INITIAL_PAYMENT_GATEWAYS);
  const [currencies, setCurrencies] = useState<CurrencyConfig[]>(INITIAL_CURRENCIES);
  const [plans, setPlans] = useState<SubscriptionPlan[]>(INITIAL_PLANS);
  const [rbacPermissions, setRbacPermissions] = useState<RolePermission[]>(INITIAL_RBAC_PERMISSIONS);

  // Localization & Multi-Currency
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');

  // Modals state
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isChannelConnectorOpen, setIsChannelConnectorOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<'admin' | 'tenant'>('tenant');
  const [checkoutModalState, setCheckoutModalState] = useState<{
    isOpen: boolean;
    itemName: string;
    amount: number;
  }>({
    isOpen: false,
    itemName: '',
    amount: 0,
  });

  // Adjust document direction for Arabic & Hebrew (RTL)
  useEffect(() => {
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang);
    const dir = langObj?.dir || 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  // Enterprise Hydration: Fetch live state from backend REST API with fallback to initial data
  useEffect(() => {
    let active = true;
    async function hydrateFromServer() {
      try {
        const [
          tenantsRes,
          channelsRes,
          campaignsRes,
          dealsRes,
          contactsRes,
          gatewaysRes,
          currenciesRes,
        ] = await Promise.allSettled([
          apiClient.getTenants(),
          apiClient.getChannels(),
          apiClient.getMetaAds(),
          apiClient.getDeals(),
          apiClient.getContacts(),
          apiClient.getPaymentGateways(),
          apiClient.getCurrencies(),
        ]);

        if (!active) return;
        if (tenantsRes.status === 'fulfilled' && tenantsRes.value?.length) {
          setWorkspaces(tenantsRes.value);
        }
        if (channelsRes.status === 'fulfilled' && channelsRes.value?.length) {
          setChannels(channelsRes.value);
        }
        if (campaignsRes.status === 'fulfilled' && campaignsRes.value?.length) {
          setCampaigns(campaignsRes.value);
        }
        if (dealsRes.status === 'fulfilled' && dealsRes.value?.length) {
          setDeals(dealsRes.value);
        }
        if (contactsRes.status === 'fulfilled' && contactsRes.value?.length) {
          setContacts(contactsRes.value);
        }
        if (gatewaysRes.status === 'fulfilled' && gatewaysRes.value?.length) {
          setPaymentGateways(gatewaysRes.value);
        }
        if (currenciesRes.status === 'fulfilled' && currenciesRes.value?.length) {
          setCurrencies(currenciesRes.value);
        }
      } catch (err) {
        // Graceful offline fallback
      }
    }
    hydrateFromServer();
    return () => {
      active = false;
    };
  }, []);

  // Handlers
  const handleSendMessage = (conversationId: string, text: string, isInternalNote = false) => {
    // 1. Optimistic UI update
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const newMsg = {
            id: `m-${Date.now()}`,
            sender: isInternalNote ? ('agent' as const) : ('agent' as const),
            senderName: isInternalNote ? 'Internal Team' : 'Demo User',
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            channel: c.channel,
            status: 'sent' as const,
            isInternalNote,
          };
          return {
            ...c,
            lastMessage: isInternalNote ? c.lastMessage : text,
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    // 2. Real backend dispatch
    apiClient.sendMessage(conversationId, text, isInternalNote).catch((e) => {
      console.warn('API message dispatch note:', e.message);
    });
  };

  const handleDispatchFlowForm = (conversationId: string, formTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const flowMsg = {
            id: `m-flow-${Date.now()}`,
            sender: 'bot' as const,
            senderName: 'WhatsApp Native Flow Node',
            text: `📋 Sent native WhatsApp Flow form: "${formTitle}". Customer can fill without redirecting.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            channel: c.channel,
            status: 'delivered' as const,
            metadata: {
              flowFormSubmitted: true,
              flowFormData: {
                service: 'Omnichannel Setup & CTWA Funnel',
                slot: 'Tomorrow, 10:30 AM',
              },
            },
          };
          return {
            ...c,
            lastMessage: `Native Flow Form sent: ${formTitle}`,
            lastMessageTime: 'Just now',
            messages: [...c.messages, flowMsg],
          };
        }
        return c;
      })
    );
  };

  const handleDispatchCatalog = (conversationId: string, itemName: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const catMsg = {
            id: `m-cat-${Date.now()}`,
            sender: 'agent' as const,
            senderName: 'Demo User',
            text: `🛍 Product Showcase: ${itemName}. In-chat 1-click cart checkout attached with automated payment gateway.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            channel: c.channel,
            status: 'delivered' as const,
          };
          return {
            ...c,
            lastMessage: `Catalog item sent: ${itemName}`,
            lastMessageTime: 'Just now',
            messages: [...c.messages, catMsg],
          };
        }
        return c;
      })
    );
  };

  const handleCreateCampaign = (camp: MetaAdCampaign) => {
    setCampaigns((prev) => [camp, ...prev]);
    apiClient.createMetaAd(camp).catch((e) => console.warn('Create campaign sync notice:', e.message));
  };

  const handleToggleCampaignStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c
      )
    );
    apiClient.toggleMetaAdStatus(id).catch((e) => console.warn('Toggle campaign status notice:', e.message));
  };

  const handleSchedulePost = (post: SocialPost) => {
    setSocialPosts((prev) => [post, ...prev]);
    apiClient.scheduleSocialPost(post).catch((e) => console.warn('Schedule post notice:', e.message));
  };

  const handleToggleBroadcastStatus = (id: string, status: any) => {
    setBroadcasts((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    apiClient.toggleBroadcastStatus(id, status).catch((e) => console.warn('Toggle broadcast notice:', e.message));
  };

  const handleAddDeal = (deal: CrmDeal) => {
    setDeals((prev) => [deal, ...prev]);
    apiClient.createDeal(deal).catch((e) => console.warn('Add deal notice:', e.message));
  };

  const handleUpdateDealStage = (dealId: string, stage: CrmDeal['stage']) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage } : d))
    );
    apiClient.updateDealStage(dealId, stage).catch((e) => console.warn('Update deal stage notice:', e.message));
  };

  const handleDispatchCartRecovery = (cartId: string) => {
    setAbandonedCarts((prev) =>
      prev.map((c) => (c.id === cartId ? { ...c, recoveryStatus: 'dispatched' } : c))
    );
    apiClient.recoverCart(cartId).catch((e) => console.warn('Cart recovery notice:', e.message));
  };

  const handleQuickLogin = (role: 'admin' | 'tenant') => {
    if (role === 'admin') {
      setMode('superadmin');
      setIsImpersonating(false);
    } else {
      setMode('tenant');
      setIsImpersonating(false);
    }
  };

  const handleImpersonateTenant = (tenant: TenantWorkspace) => {
    setCurrentWorkspace(tenant);
    setIsImpersonating(true);
    setMode('tenant');
    apiClient.impersonateTenant(tenant.id).catch((e) => console.warn('Impersonate notice:', e.message));
  };

  const handleUpdateGatewayMode = (id: string, gatewayMode: 'live' | 'test') => {
    setPaymentGateways((prev) =>
      prev.map((g) => (g.id === id ? { ...g, mode: gatewayMode } : g))
    );
    apiClient.updateGatewayMode(id, gatewayMode).catch((e) => console.warn('Gateway mode notice:', e.message));
  };

  const handleUpdateCurrencyRate = (code: string, newRate: number) => {
    setCurrencies((prev) =>
      prev.map((c) => (c.code === code ? { ...c, exchangeRateToUSD: newRate } : c))
    );
    apiClient.updateCurrencyRate(code, newRate).catch((e) => console.warn('Currency rate notice:', e.message));
  };

  const handleNewChannelAdded = (newChannel: ChannelInfo) => {
    setChannels((prev) => [newChannel, ...prev]);
    apiClient.createChannel(newChannel).catch((e) => console.warn('Create channel notice:', e.message));
  };

  const currentCurrencyObj = currencies.find((c) => c.code === selectedCurrency) || currencies[0];

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#070B14] text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Impersonation Audit Banner */}
      {isImpersonating && mode === 'tenant' && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-lg shrink-0 z-50">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>
              Audit-Logged Tenant Session Impersonation Active: Acting as <strong>{currentWorkspace.name}</strong> ({currentWorkspace.ownerEmail})
            </span>
          </div>
          <button
            onClick={() => {
              setIsImpersonating(false);
              setMode('superadmin');
            }}
            className="px-2.5 py-1 rounded-md bg-slate-950 text-white text-[11px] font-bold flex items-center gap-1.5 hover:bg-slate-900 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Impersonation</span>
          </button>
        </div>
      )}

      {/* Sticky/Fixed Top Navbar */}
      <TopNavbar
        mode={mode}
        setMode={setMode}
        workspaces={workspaces}
        currentWorkspace={currentWorkspace}
        setCurrentWorkspace={setCurrentWorkspace}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        currencies={currencies}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenChannelConnector={() => setIsChannelConnectorOpen(true)}
        onOpenAuthModal={(authRole) => {
          setAuthModalRole(authRole || 'tenant');
          setIsAuthModalOpen(true);
        }}
      />

      {/* Main Mode Viewport */}
      <div className="flex-1 h-[calc(100vh-4rem)] overflow-hidden relative">
        {mode === 'landing' && (
          <div className="h-full overflow-y-auto bg-[#070B14]">
            <LandingPage
              setMode={setMode}
              plans={plans}
              selectedCurrency={selectedCurrency}
              currencies={currencies}
              onQuickLogin={handleQuickLogin}
            />
          </div>
        )}

        {mode === 'tenant' && (
          <TenantLayout
            currentWorkspace={currentWorkspace}
            channels={channels}
            conversations={conversations}
            contacts={contacts}
            campaigns={campaigns}
            flowNodes={flowNodes}
            flowEdges={flowEdges}
            flowTemplates={flowTemplates}
            flowForms={flowForms}
            catalogItems={catalogItems}
            chatbots={chatbots}
            knowledgeDocs={knowledgeDocs}
            socialPosts={socialPosts}
            broadcasts={broadcasts}
            deals={deals}
            staff={staff}
            abandonedCarts={abandonedCarts}
            rbacPermissions={rbacPermissions}
            onSendMessage={handleSendMessage}
            onDispatchFlowForm={handleDispatchFlowForm}
            onDispatchCatalog={handleDispatchCatalog}
            onCreateCampaign={handleCreateCampaign}
            onToggleCampaignStatus={handleToggleCampaignStatus}
            onSchedulePost={handleSchedulePost}
            onToggleBroadcastStatus={handleToggleBroadcastStatus}
            onAddDeal={handleAddDeal}
            onUpdateDealStage={handleUpdateDealStage}
            onDispatchCartRecovery={handleDispatchCartRecovery}
          />
        )}

        {mode === 'superadmin' && (
          <div className="h-full overflow-y-auto bg-[#070B14]">
            <SuperAdminDashboard
              tenants={workspaces}
              paymentGateways={paymentGateways}
              currencies={currencies}
              plans={plans}
              onImpersonateTenant={handleImpersonateTenant}
              onUpdateGatewayMode={handleUpdateGatewayMode}
              onUpdateCurrencyRate={handleUpdateCurrencyRate}
            />
          </div>
        )}

        {mode === 'booking' && (
          <div className="h-full overflow-y-auto bg-[#070B14]">
            <PublicBookingPage
              staff={staff}
              onBackToApp={() => setMode('tenant')}
            />
          </div>
        )}
      </div>

      {/* Autonomous Platform AI Copilot Drawer */}
      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />

      {/* Floating Real-Time Live Chat Widget */}
      <LiveChatWidget />

      {/* Multi-Channel Connection Dialog */}
      <ChannelConnectorModal
        isOpen={isChannelConnectorOpen}
        onClose={() => setIsChannelConnectorOpen(false)}
        onChannelConnected={handleNewChannelAdded}
      />

      {/* 8-Gateway Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutModalState.isOpen}
        onClose={() => setCheckoutModalState({ isOpen: false, itemName: '', amount: 0 })}
        itemName={checkoutModalState.itemName}
        amount={checkoutModalState.amount}
        currency={selectedCurrency}
        currencySymbol={currentCurrencyObj.symbol}
        gateways={paymentGateways}
        onSuccess={(details) => {
          alert(`Success! Payment confirmed via ${details.gateway} (${details.currency} ${details.amount}). TX: ${details.txId}`);
        }}
      />

      {/* Sign In & Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRole={authModalRole}
        onSuccessLogin={(loggedInRole) => {
          handleQuickLogin(loggedInRole);
        }}
      />
    </div>
  );
}
