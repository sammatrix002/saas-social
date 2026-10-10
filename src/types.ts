export type AppMode = 'landing' | 'tenant' | 'superadmin' | 'booking';

export type TenantTab =
  | 'dashboard'
  | 'inbox'
  | 'ctwa_ads'
  | 'flow_forms'
  | 'catalog'
  | 'flow_builder'
  | 'chatbots'
  | 'social_scheduler'
  | 'broadcasts'
  | 'crm_deals'
  | 'calendar_booking'
  | 'ecommerce'
  | 'ai_telemetry'
  | 'rbac_settings';

export type SuperAdminTab =
  | 'overview'
  | 'tenants'
  | 'payment_gateways'
  | 'multi_currency'
  | 'ai_vault'
  | 'meta_app'
  | 'system_mailer'
  | 'support_tickets';

export type ChannelType =
  | 'whatsapp_cloud'
  | 'whatsapp_baileys'
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'linkedin'
  | 'telegram'
  | 'sms'
  | 'email'
  | 'livechat';

export interface ChannelInfo {
  id: string;
  type: ChannelType;
  name: string;
  accountHandle: string;
  status: 'connected' | 'disconnected' | 'needs_reconnect';
  badgeColor: string;
  iconName: string;
  assignedAgents: string[];
  unreadCount: number;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  lifecycleStage: 'Lead' | 'Prospect' | 'Customer' | 'VIP' | 'Churned';
  tags: string[];
  source: string;
  assignedAgent: string;
  notes?: string;
  customFields: Record<string, string>;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'agent' | 'bot' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  channel: ChannelType;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
  isInternalNote?: boolean;
  metadata?: {
    flowFormSubmitted?: boolean;
    flowFormData?: Record<string, any>;
    catalogItems?: any[];
    cartTotal?: string;
  };
}

export interface Conversation {
  id: string;
  contactId: string;
  channel: ChannelType;
  status: 'open' | 'pending' | 'resolved';
  assignedAgent: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface MetaAdCampaign {
  id: string;
  name: string;
  platform: 'facebook' | 'instagram' | 'both';
  headline: string;
  primaryText: string;
  callToAction: 'Send WhatsApp Message' | 'Chat Now' | 'Get Offer';
  budgetDaily: number;
  currency: string;
  status: 'active' | 'paused' | 'draft';
  impressions: number;
  clicks: number;
  spend: number;
  leadsCaptured: number;
  conversationsStarted: number;
  ctwaTriggerKeyword: string;
  targetFlowId: string;
  mediaUrl: string;
}

export interface FlowNode {
  id: string;
  type:
    | 'trigger'
    | 'message'
    | 'interactive_menu'
    | 'whatsapp_flow'
    | 'catalog_showcase'
    | 'ask_question'
    | 'ai_prompt'
    | 'ai_condition'
    | 'rag_query'
    | 'delay_wait'
    | 'tag_contact'
    | 'crm_deal'
    | 'book_appointment'
    | 'webhook'
    | 'zapier_hook'
    | 'n8n_node'
    | 'check_cart'
    | 'human_handoff';
  title: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface FlowTemplate {
  id: string;
  name: string;
  category: 'Lead Gen' | 'E-Commerce' | 'Customer Support' | 'Booking';
  description: string;
  nodeCount: number;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface WhatsAppFlowForm {
  id: string;
  title: string;
  formType: 'Appointment Booking' | 'KYC Verification' | 'CSAT Survey' | 'Lead Qualification';
  screens: {
    id: string;
    title: string;
    fields: {
      id: string;
      label: string;
      type: 'text' | 'select' | 'date' | 'radio' | 'checkbox';
      required: boolean;
      options?: string[];
    }[];
  }[];
  submissionCount: number;
  status: 'published' | 'draft';
}

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  sku: string;
  inStock: boolean;
  image: string;
  description: string;
}

export interface AiChatBot {
  id: string;
  name: string;
  persona: string;
  systemPrompt: string;
  temperature: number;
  model: string;
  assignedChannels: ChannelType[];
  businessHoursOnly: boolean;
  outOfOfficeReply: string;
  humanHandoffTrigger: string[];
  ragKnowledgeIds: string[];
  totalTurns: number;
  active: boolean;
}

export interface KnowledgeDoc {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt' | 'qa' | 'url' | 'sheets';
  chunkCount: number;
  uploadedAt: string;
  size: string;
  previewContent: string;
}

export interface SocialPost {
  id: string;
  content: string;
  platforms: ('facebook' | 'instagram' | 'tiktok' | 'linkedin' | 'telegram')[];
  scheduledFor: string;
  status: 'published' | 'scheduled' | 'draft';
  mediaUrl?: string;
  author: string;
  metrics?: {
    reach: number;
    likes: number;
    comments: number;
  };
}

export interface BroadcastCampaign {
  id: string;
  name: string;
  channel: ChannelType;
  templateName: string;
  targetAudience: string;
  totalRecipients: number;
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  failed: number;
  status: 'running' | 'paused' | 'completed' | 'cancelled' | 'scheduled';
  delayPerMessageSec: number;
  jitterWindowSec: number;
}

export interface CrmDeal {
  id: string;
  title: string;
  contactName: string;
  contactPhone: string;
  stage: 'Lead In' | 'Contact Made' | 'Qualified' | 'Proposal Sent' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  value: number;
  currency: string;
  assignedAgent: string;
  expectedCloseDate: string;
  createdAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  timezone: string;
  availableDays: string[];
  bookingSlug: string;
  meetingProvider: 'Google Meet' | 'Zoom' | 'MS Teams';
}

export interface AbandonedCart {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  store: 'Shopify' | 'WooCommerce';
  items: { name: string; qty: number; price: number }[];
  cartTotal: number;
  currency: string;
  abandonedAt: string;
  recoveryScheduledAt: string;
  couponCode: string;
  recoveryStatus: 'pending' | 'dispatched' | 'recovered' | 'expired';
}

export interface PaymentGatewayConfig {
  id: string;
  name: string;
  logo: string;
  region: string;
  supportedMethods: string[];
  mode: 'live' | 'test';
  enabled: boolean;
  apiKey: string;
  secretKey: string;
  webhookSecret: string;
  lastTestStatus: 'verified' | 'failed' | 'not_tested';
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  exchangeRateToUSD: number;
  isDefault: boolean;
  isActive: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  badge?: string;
  tagline: string;
  maxWorkspaces: number;
  maxChannels: number;
  maxTeamSeats: number;
  flowCredits: number;
  copilotCredits: number;
  monthlyPrices: Record<string, number>;
  annualPrices: Record<string, number>;
  features: string[];
}

export interface TenantWorkspace {
  id: string;
  name: string;
  slug: string;
  ownerEmail: string;
  planId: string;
  status: 'active' | 'suspended';
  channelCount: number;
  teamSeatsUsed: number;
  tokensConsumedTotal: number;
  copilotCreditsRemaining: number;
  flowCreditsRemaining: number;
  createdAt: string;
}

export interface RolePermission {
  module: string;
  displayName: string;
  read: boolean;
  write: boolean;
}
