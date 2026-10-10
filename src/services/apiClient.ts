/**
 * WhatsOmni v3.0 Enterprise REST API Client Service
 * Bridges all frontend UI modules to Express server and persistent database store.
 */

import {
  ChannelInfo,
  Contact,
  Conversation,
  MetaAdCampaign,
  CrmDeal,
  FlowNode,
  FlowEdge,
  WhatsAppFlowForm,
  CatalogItem,
  AiChatBot,
  KnowledgeDoc,
  SocialPost,
  BroadcastCampaign,
  StaffMember,
  AbandonedCart,
  PaymentGatewayConfig,
  CurrencyConfig,
  SubscriptionPlan,
  RolePermission,
  TenantWorkspace,
} from '../types.ts';

const API_BASE = '/api';

class ApiClient {
  private token: string = 'omni_ten_live_token_9921';
  private currentWorkspaceId: string = 'ws-1';

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('whatsomni_auth_token');
      if (stored) this.token = stored;
      const ws = localStorage.getItem('whatsomni_workspace_id');
      if (ws) this.currentWorkspaceId = ws;
    }
  }

  public setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('whatsomni_auth_token', token);
    }
  }

  public setWorkspaceId(workspaceId: string) {
    this.currentWorkspaceId = workspaceId;
    if (typeof window !== 'undefined') {
      localStorage.setItem('whatsomni_workspace_id', workspaceId);
    }
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
      'x-workspace-id': this.currentWorkspaceId,
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      ...this.getHeaders(),
      ...(options.headers as Record<string, string>),
    };

    try {
      const res = await fetch(url, { ...options, headers });
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(errorBody.message || errorBody.error || `HTTP ${res.status}`);
      }
      return await res.json();
    } catch (err: any) {
      console.warn(`[ApiClient] Request to ${endpoint} failed:`, err.message);
      throw err;
    }
  }

  // 1. Health
  public async getHealth() {
    return this.request<{ status: string; version: string; platform: string }>('/health');
  }

  // 2. Auth & OTP
  public async login(email: string, password: string) {
    const data = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  public async getMe() {
    return this.request<{ user: any; tenantId: string; workspaceId: string }>('/auth/me');
  }

  public async requestOtp() {
    return this.request<{ message: string; debugCode?: string }>('/auth/request-otp', {
      method: 'POST',
    });
  }

  public async verifyOtp(code: string) {
    return this.request<{ verified: boolean; message: string }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  // 3. Tenants & Workspaces
  public async getTenants(): Promise<TenantWorkspace[]> {
    return this.request<TenantWorkspace[]>('/tenants');
  }

  public async impersonateTenant(id: string) {
    return this.request<{ token: string; message: string; tenant: TenantWorkspace }>(
      `/tenants/${id}/impersonate`,
      { method: 'POST' }
    );
  }

  public async updateCredits(tenantId: string, copilotCredits: number, flowCredits: number) {
    return this.request(`/tenants/${tenantId}/credits`, {
      method: 'POST',
      body: JSON.stringify({ copilotCredits, flowCredits }),
    });
  }

  // 4. Omnichannel Channels
  public async getChannels(): Promise<ChannelInfo[]> {
    return this.request<ChannelInfo[]>('/channels');
  }

  public async createChannel(channel: Partial<ChannelInfo>): Promise<ChannelInfo> {
    return this.request<ChannelInfo>('/channels', {
      method: 'POST',
      body: JSON.stringify(channel),
    });
  }

  // 5. Shared Inbox & Real-time Messaging
  public async getConversations(filter?: { channel?: string; status?: string; search?: string }): Promise<Conversation[]> {
    const params = new URLSearchParams();
    if (filter?.channel) params.append('channel', filter.channel);
    if (filter?.status) params.append('status', filter.status);
    if (filter?.search) params.append('search', filter.search);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return this.request<Conversation[]>(`/inbox/conversations${qs}`);
  }

  public async getMessages(conversationId: string) {
    return this.request(`/inbox/conversations/${conversationId}/messages`);
  }

  public async sendMessage(
    conversationId: string,
    text: string,
    isInternalNote = false,
    senderName?: string
  ) {
    return this.request(`/inbox/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text, isInternalNote, senderName }),
    });
  }

  public async getSmartReplies(message: string, customerName?: string) {
    return this.request<{ replies: string[] }>('/ai/smart-reply', {
      method: 'POST',
      body: JSON.stringify({ message, customerName }),
    });
  }

  // 6. Meta Ads & CTWA Engine
  public async getMetaAds(): Promise<MetaAdCampaign[]> {
    return this.request<MetaAdCampaign[]>('/meta-ads');
  }

  public async getMetaAdsMetrics(): Promise<{
    totalSpend: number;
    totalLeads: number;
    totalConversations: number;
    totalImpressions: number;
    totalClicks: number;
    avgCostPerLead: string;
    conversionRate: string;
  }> {
    return this.request('/meta-ads/metrics');
  }

  public async createMetaAd(campaign: Partial<MetaAdCampaign>): Promise<MetaAdCampaign> {
    return this.request<MetaAdCampaign>('/meta-ads', {
      method: 'POST',
      body: JSON.stringify(campaign),
    });
  }

  public async toggleMetaAdStatus(id: string): Promise<MetaAdCampaign> {
    return this.request<MetaAdCampaign>(`/meta-ads/${id}/status`, {
      method: 'PATCH',
    });
  }

  // 7. CRM Contacts & Deals
  public async getContacts(): Promise<Contact[]> {
    return this.request<Contact[]>('/crm/contacts');
  }

  public async createContact(contact: Partial<Contact>): Promise<Contact> {
    return this.request<Contact>('/crm/contacts', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
  }

  public async getDeals(): Promise<CrmDeal[]> {
    return this.request<CrmDeal[]>('/crm/deals');
  }

  public async createDeal(deal: Partial<CrmDeal>): Promise<CrmDeal> {
    return this.request<CrmDeal>('/crm/deals', {
      method: 'POST',
      body: JSON.stringify(deal),
    });
  }

  public async updateDealStage(id: string, stage: CrmDeal['stage']): Promise<CrmDeal> {
    return this.request<CrmDeal>(`/crm/deals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ stage }),
    });
  }

  // 8. Flows & WhatsApp Flow Forms
  public async getFlows() {
    return this.request('/flows');
  }

  public async createFlow(flow: { name: string; description?: string; nodes: FlowNode[]; edges: FlowEdge[] }) {
    return this.request('/flows', {
      method: 'POST',
      body: JSON.stringify(flow),
    });
  }

  public async getFlowForms(): Promise<WhatsAppFlowForm[]> {
    return this.request<WhatsAppFlowForm[]>('/flow-forms');
  }

  public async createFlowForm(form: Partial<WhatsAppFlowForm>): Promise<WhatsAppFlowForm> {
    return this.request<WhatsAppFlowForm>('/flow-forms', {
      method: 'POST',
      body: JSON.stringify(form),
    });
  }

  // 9. Catalog
  public async getCatalog(): Promise<CatalogItem[]> {
    return this.request<CatalogItem[]>('/catalog');
  }

  public async createCatalogItem(item: Partial<CatalogItem>): Promise<CatalogItem> {
    return this.request<CatalogItem>('/catalog', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  // 10. AI Chatbots & RAG
  public async getChatbots(): Promise<AiChatBot[]> {
    return this.request<AiChatBot[]>('/chatbots');
  }

  public async createChatbot(bot: Partial<AiChatBot>): Promise<AiChatBot> {
    return this.request<AiChatBot>('/chatbots', {
      method: 'POST',
      body: JSON.stringify(bot),
    });
  }

  public async getKnowledgeDocs(): Promise<KnowledgeDoc[]> {
    return this.request<KnowledgeDoc[]>('/knowledge-docs');
  }

  public async createKnowledgeDoc(doc: Partial<KnowledgeDoc>): Promise<KnowledgeDoc> {
    return this.request<KnowledgeDoc>('/knowledge-docs', {
      method: 'POST',
      body: JSON.stringify(doc),
    });
  }

  // 11. Social Scheduler & Broadcasts
  public async getSocialPosts(): Promise<SocialPost[]> {
    return this.request<SocialPost[]>('/social-posts');
  }

  public async scheduleSocialPost(post: Partial<SocialPost>): Promise<SocialPost> {
    return this.request<SocialPost>('/social-posts', {
      method: 'POST',
      body: JSON.stringify(post),
    });
  }

  public async generateSocialCopy(topic: string, platform?: string, tone?: string) {
    return this.request<{ content: string }>('/ai/social-copy', {
      method: 'POST',
      body: JSON.stringify({ topic, platform, tone }),
    });
  }

  public async getBroadcasts(): Promise<BroadcastCampaign[]> {
    return this.request<BroadcastCampaign[]>('/broadcasts');
  }

  public async toggleBroadcastStatus(id: string, status: any): Promise<BroadcastCampaign> {
    return this.request<BroadcastCampaign>(`/broadcasts/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // 12. Staff & Booking
  public async getStaff(): Promise<StaffMember[]> {
    return this.request<StaffMember[]>('/staff');
  }

  public async reserveBooking(payload: {
    staffId: string;
    slot: string;
    customerName: string;
    customerEmail: string;
    notes?: string;
  }) {
    return this.request<{ success: boolean; bookingId: string; message: string }>('/booking/reserve', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // 13. Abandoned Carts
  public async getAbandonedCarts(): Promise<AbandonedCart[]> {
    return this.request<AbandonedCart[]>('/abandoned-carts');
  }

  public async recoverCart(id: string) {
    return this.request<{ success: boolean; cart: AbandonedCart }>(`/abandoned-carts/${id}/recover`, {
      method: 'POST',
    });
  }

  // 14. Billing, Gateways & Multi-Currency
  public async getPaymentGateways(): Promise<PaymentGatewayConfig[]> {
    return this.request<PaymentGatewayConfig[]>('/billing/gateways');
  }

  public async updateGatewayMode(id: string, mode: 'live' | 'test'): Promise<PaymentGatewayConfig> {
    return this.request<PaymentGatewayConfig>(`/billing/gateways/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ mode }),
    });
  }

  public async getCurrencies(): Promise<CurrencyConfig[]> {
    return this.request<CurrencyConfig[]>('/billing/currencies');
  }

  public async updateCurrencyRate(code: string, exchangeRateToUSD: number): Promise<CurrencyConfig> {
    return this.request<CurrencyConfig>(`/billing/currencies/${code}`, {
      method: 'PATCH',
      body: JSON.stringify({ exchangeRateToUSD }),
    });
  }

  public async getPlans(): Promise<SubscriptionPlan[]> {
    return this.request<SubscriptionPlan[]>('/billing/plans');
  }

  // 15. RBAC & Security Audit Logs
  public async getRbacPermissions(): Promise<RolePermission[]> {
    return this.request<RolePermission[]>('/rbac/permissions');
  }

  public async updateRbacPermissions(permissions: RolePermission[]) {
    return this.request('/rbac/permissions', {
      method: 'PATCH',
      body: JSON.stringify({ permissions }),
    });
  }

  public async getAuditLogs() {
    return this.request('/audit-logs');
  }

  // 16. Platform AI Copilot & Prompt-To-Flow
  public async askCopilot(prompt: string, context?: any) {
    return this.request<{ reply: string; model?: string; latencyMs?: number; tokensUsed?: any }>(
      '/ai/copilot',
      {
        method: 'POST',
        body: JSON.stringify({ prompt, context }),
      }
    );
  }

  public async promptToFlow(prompt: string) {
    return this.request<{ flowName: string; nodes: any[]; edges: any[] }>('/ai/prompt-to-flow', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }

  public async getAiTelemetry() {
    return this.request('/ai/telemetry');
  }
}

export const apiClient = new ApiClient();
