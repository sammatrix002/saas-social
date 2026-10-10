import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { PostgresStorageAdapter } from './postgresStorage.ts';

export interface DatabaseSchema {
  tenants: any[];
  workspaces: any[];
  users: any[];
  channels: any[];
  contacts: any[];
  conversations: any[];
  messages: any[];
  campaigns: any[];
  deals: any[];
  flows: any[];
  flowForms: any[];
  catalogItems: any[];
  chatbots: any[];
  knowledgeDocs: any[];
  knowledgeChunks: any[];
  socialPosts: any[];
  broadcasts: any[];
  staff: any[];
  abandonedCarts: any[];
  paymentGateways: any[];
  currencies: any[];
  plans: any[];
  subscriptions: any[];
  invoices: any[];
  webhookEvents: any[];
  aiTelemetryLogs: any[];
  auditLogs: any[];
  rbacRoles: any[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'whatsomni_production.json');

class DatabaseStore {
  private data: DatabaseSchema;
  private isLoaded = false;
  private writeTimeout: NodeJS.Timeout | null = null;
  private postgresAdapter: PostgresStorageAdapter | null = null;

  constructor() {
    this.data = this.getDefaultSchema();
    this.init();
    if ((process.env.DATA_STORE_MODE === 'postgres' || process.env.DATA_STORE_MODE === 'relational') && process.env.DATABASE_URL) {
      this.postgresAdapter = new PostgresStorageAdapter();
      this.postgresAdapter.connect().catch((err) => {
        console.warn('[DatabaseStore] PostgreSQL auto-connect error:', err.message);
      });
    }
  }

  private getDefaultSchema(): DatabaseSchema {
    return {
      tenants: [],
      workspaces: [],
      users: [],
      channels: [],
      contacts: [],
      conversations: [],
      messages: [],
      campaigns: [],
      deals: [],
      flows: [],
      flowForms: [],
      catalogItems: [],
      chatbots: [],
      knowledgeDocs: [],
      knowledgeChunks: [],
      socialPosts: [],
      broadcasts: [],
      staff: [],
      abandonedCarts: [],
      paymentGateways: [],
      currencies: [],
      plans: [],
      subscriptions: [],
      invoices: [],
      webhookEvents: [],
      aiTelemetryLogs: [],
      auditLogs: [],
      rbacRoles: [],
    };
  }

  private init() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = { ...this.getDefaultSchema(), ...parsed };
        this.ensureSeeded();
        this.flushSync();
      } else {
        this.seedInitialData();
        this.flushSync();
      }
      this.isLoaded = true;
    } catch (err) {
      console.error('Error initializing database store:', err);
      this.data = this.getDefaultSchema();
      this.seedInitialData();
    }
  }

  private ensureSeeded() {
    const tenantId = 'ten-1';
    const workspaceId = 'ws-1';

    if (!this.data.flows || this.data.flows.length === 0) {
      this.data.flows = [
        {
          id: 'flow-ecommerce-cart',
          tenantId,
          workspaceId,
          name: 'Meta CTWA E-Commerce Flash Sale Funnel',
          description: 'Autonomous conversion funnel routing Meta Ad keyword #AUTUMN25 to Native Flow Form & Checkout',
          active: true,
          nodeCount: 5,
          nodes: [
            { id: 'n-1', type: 'trigger', title: 'Meta Ad CTWA Trigger (#AUTUMN25)', config: { keyword: '#AUTUMN25' }, position: { x: 50, y: 150 } },
            { id: 'n-2', type: 'message', title: 'AI Concierge Welcome', config: { text: 'Hello {{contact.name}}! Claim your 25% off VIP voucher.' }, position: { x: 350, y: 150 } },
            { id: 'n-3', type: 'whatsapp_flow', title: 'Native Flow Form (VIP Claim)', config: { formId: 'form-vip-claim' }, position: { x: 650, y: 150 } },
            { id: 'n-4', type: 'crm_deal', title: 'Create Qualified Deal', config: { stage: 'Qualified', value: 150 }, position: { x: 950, y: 150 } },
          ],
          edges: [
            { id: 'e-1-2', source: 'n-1', target: 'n-2' },
            { id: 'e-2-3', source: 'n-2', target: 'n-3' },
            { id: 'e-3-4', source: 'n-3', target: 'n-4' },
          ],
        },
      ];
    }

    if (!this.data.flowForms || this.data.flowForms.length === 0) {
      this.data.flowForms = [
        {
          id: 'form-vip-claim',
          tenantId,
          workspaceId,
          name: 'VIP Autumn 25% Voucher & Consultation Form',
          category: 'Lead Capture & Booking',
          screens: 2,
          submissions: 428,
          conversionRate: '94.2%',
          status: 'published',
          createdAt: '2026-09-12',
        },
        {
          id: 'form-kyc-verify',
          tenantId,
          workspaceId,
          name: 'Express Customer KYC & Verification',
          category: 'Compliance & Verification',
          screens: 3,
          submissions: 184,
          conversionRate: '88.7%',
          status: 'published',
          createdAt: '2026-09-18',
        },
      ];
    }

    if (!this.data.catalogItems || this.data.catalogItems.length === 0) {
      this.data.catalogItems = [
        {
          id: 'cat-1',
          tenantId,
          workspaceId,
          name: 'Precision Titanium Smartwatch Pro',
          price: 249,
          currency: 'USD',
          sku: 'WATCH-TITANIUM-01',
          stock: 45,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
          category: 'Wearables',
        },
        {
          id: 'cat-2',
          tenantId,
          workspaceId,
          name: 'Studio Wireless ANC Headphones',
          price: 179,
          currency: 'USD',
          sku: 'AUDIO-ANC-PRO',
          stock: 82,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
          category: 'Audio',
        },
      ];
    }

    if (!this.data.chatbots || this.data.chatbots.length === 0) {
      this.data.chatbots = [
        {
          id: 'bot-1',
          tenantId,
          workspaceId,
          name: 'OmniSupport Concierge',
          persona: 'Polite, technical, solutions-driven enterprise support specialist',
          systemPrompt: 'You are the primary customer intelligence bot for WhatsOmni. Answer accurately using only verified RAG chunks.',
          temperature: 0.3,
          model: 'gemini-3.8-flash',
          assignedChannels: ['whatsapp_cloud', 'telegram', 'livechat'],
          businessHoursOnly: false,
          totalTurns: 1840,
          active: true,
        },
      ];
    }

    if (!this.data.knowledgeDocs || this.data.knowledgeDocs.length === 0) {
      this.data.knowledgeDocs = [
        {
          id: 'doc-1',
          tenantId,
          workspaceId,
          name: 'WhatsOmni_v3_Documentation_Hub.pdf',
          type: 'pdf',
          chunkCount: 142,
          uploadedAt: '2026-09-15',
          size: '3.8 MB',
          previewContent: 'WhatsOmni v3.0 Architecture: 10 messaging gateways, Meta Embedded Signup, Baileys WebSocket microservice, 8-gateway billing.',
        },
      ];
    }

    if (!this.data.socialPosts || this.data.socialPosts.length === 0) {
      this.data.socialPosts = [
        {
          id: 'post-1',
          tenantId,
          workspaceId,
          content: '🚨 Major Release: WhatsOmni v3.0 is live! Unify WhatsApp Cloud API, Instagram, TikTok, LinkedIn, and Telegram into a single command center.\n\n#WhatsOmni #Omnichannel #MetaAds',
          platforms: ['facebook', 'instagram', 'linkedin', 'telegram'],
          scheduledFor: '2026-10-07T14:00:00Z',
          status: 'published',
          author: 'Demo User',
          metrics: { reach: 14200, likes: 640, comments: 84 },
        },
      ];
    }

    if (!this.data.broadcasts || this.data.broadcasts.length === 0) {
      this.data.broadcasts = [
        {
          id: 'bc-1',
          tenantId,
          workspaceId,
          name: 'VIP Client Autumn Product Showcase',
          channel: 'whatsapp_cloud',
          templateName: 'autumn_vip_collection_v2',
          targetAudience: 'Tags: [VIP, High Intent] (850 Contacts)',
          totalRecipients: 850,
          sent: 850,
          delivered: 842,
          read: 760,
          replied: 218,
          failed: 8,
          status: 'completed',
          delayPerMessageSec: 0.2,
          jitterWindowSec: 0.1,
        },
      ];
    }

    if (!this.data.staff || this.data.staff.length === 0) {
      this.data.staff = [
        {
          id: 'staff-1',
          tenantId,
          workspaceId,
          name: 'Sarah Connor',
          email: 'sarah.connor@whatsomni.com',
          role: 'Lead Solutions Architect',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          timezone: 'UTC+1 (London)',
          availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          bookingSlug: 'sarah-architect',
          meetingProvider: 'Google Meet',
        },
        {
          id: 'staff-2',
          tenantId,
          workspaceId,
          name: 'Alex Mercer',
          email: 'alex.mercer@whatsomni.com',
          role: 'Meta CTWA Funnel Specialist',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          timezone: 'UTC-5 (New York)',
          availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          bookingSlug: 'alex-meta-funnel',
          meetingProvider: 'Zoom',
        },
      ];
    }

    if (!this.data.abandonedCarts || this.data.abandonedCarts.length === 0) {
      this.data.abandonedCarts = [
        {
          id: 'cart-1',
          tenantId,
          workspaceId,
          customerName: 'Karim Al-Hassan',
          customerPhone: '+966 55 987 6543',
          customerEmail: 'karim.hassan@riyadhcorp.sa',
          store: 'Shopify',
          items: [
            { name: 'Precision Titanium Smartwatch Pro', qty: 1, price: 249 },
            { name: 'Studio Wireless ANC Headphones', qty: 1, price: 179 },
          ],
          cartTotal: 428,
          currency: 'SAR',
          abandonedAt: '24 mins ago',
          recoveryScheduledAt: '6 mins remaining (30m queue)',
          couponCode: 'SAVE15-RECOVER',
          recoveryStatus: 'pending',
        },
      ];
    }

    if (!this.data.plans || this.data.plans.length === 0) {
      this.data.plans = [
        {
          id: 'plan-starter',
          name: 'Starter Launch',
          tagline: 'For fast-growing digital agencies & boutique storefronts',
          maxWorkspaces: 2,
          maxChannels: 3,
          maxTeamSeats: 5,
          flowCredits: 10000,
          copilotCredits: 250,
          monthlyPrices: { USD: 49, EUR: 45, GBP: 39, SAR: 185, AED: 180, EGP: 2350, INR: 4100, BRL: 265 },
          annualPrices: { USD: 39, EUR: 36, GBP: 31, SAR: 148, AED: 144, EGP: 1880, INR: 3280, BRL: 212 },
        },
        {
          id: 'plan-pro',
          name: 'Growth Pro',
          badge: 'Most Popular',
          tagline: 'For scaling B2B businesses & active e-commerce brands',
          maxWorkspaces: 5,
          maxChannels: 8,
          maxTeamSeats: 20,
          flowCredits: 50000,
          copilotCredits: 1200,
          monthlyPrices: { USD: 129, EUR: 119, GBP: 102, SAR: 485, AED: 475, EGP: 6250, INR: 10800, BRL: 700 },
          annualPrices: { USD: 99, EUR: 92, GBP: 79, SAR: 375, AED: 365, EGP: 4800, INR: 8300, BRL: 540 },
        },
      ];
    }

    if (!this.data.rbacRoles || this.data.rbacRoles.length === 0) {
      this.data.rbacRoles = [
        { module: 'shared_inbox', displayName: 'Real-Time Shared Inbox', read: true, write: true },
        { module: 'channel_assignment', displayName: 'Channel Isolation & Assignment', read: true, write: true },
        { module: 'ctwa_ads', displayName: 'Meta Ads & CTWA Engine', read: true, write: true },
        { module: 'flow_forms', displayName: 'WhatsApp Native Flow Forms', read: true, write: true },
        { module: 'catalog_checkout', displayName: 'WhatsApp Catalog & Cart Checkout', read: true, write: true },
        { module: 'flow_builder', displayName: 'Visual Automation Flow Builder', read: true, write: true },
        { module: 'chatbots_rag', displayName: 'AI ChatBots & Vector RAG Engine', read: true, write: true },
        { module: 'social_scheduler', displayName: 'Cross-Platform Social Scheduler', read: true, write: true },
        { module: 'broadcast_engine', displayName: 'Anti-Ban Broadcast Campaigns', read: true, write: true },
        { module: 'kanban_crm', displayName: 'Kanban Deals CRM & Contacts', read: true, write: true },
        { module: 'calendar_booking', displayName: 'Staff Calendar & Public Booking', read: true, write: true },
        { module: 'ecommerce_recovery', displayName: 'Shopify / WooCommerce Cart Recovery', read: true, write: true },
        { module: 'copilot_assistant', displayName: 'Platform AI Copilot Access', read: true, write: true },
        { module: 'ai_telemetry', displayName: 'AI Token & Cost Telemetry', read: true, write: false },
        { module: 'team_management', displayName: 'Team Members & Roles', read: true, write: true },
        { module: 'payment_billing', displayName: 'Payment & Subscription Billing', read: true, write: true },
        { module: 'api_keys_vault', displayName: 'BYOK API Keys & Credentials', read: true, write: true },
        { module: 'system_webhooks', displayName: 'Webhooks & External Integrations', read: true, write: true },
        { module: 'audit_logs', displayName: 'Security Logs & Telemetry', read: true, write: false },
      ];
    }
  }

  private seedInitialData() {
    const tenantId = 'ten-1';
    const workspaceId = 'ws-1';

    // 1. Initial Tenants & Workspaces
    this.data.tenants = [
      {
        id: tenantId,
        name: 'Acme Global Commerce',
        slug: 'acme-commerce',
        status: 'active',
        planId: 'plan-pro',
        ownerEmail: 'demo@whatsomni.com',
        createdAt: '2026-08-10T00:00:00Z',
      },
      {
        id: 'ten-2',
        name: 'Starlight Digital Agency',
        slug: 'starlight-agency',
        status: 'active',
        planId: 'plan-enterprise',
        ownerEmail: 'contact@starlightagency.com',
        createdAt: '2026-07-22T00:00:00Z',
      },
    ];

    this.data.workspaces = [
      {
        id: workspaceId,
        tenantId: tenantId,
        name: 'Acme Primary Storefront',
        slug: 'acme-primary',
        isDefault: true,
        copilotCredits: 980,
        flowCredits: 42100,
        createdAt: '2026-08-10T00:00:00Z',
      },
    ];

    // 2. Users (Super Admin & Demo Tenant)
    const salt = crypto.randomBytes(16).toString('hex');
    const adminHash = crypto.scryptSync('Password123!', salt, 64).toString('hex');

    this.data.users = [
      {
        id: 'usr-admin',
        tenantId: null,
        workspaceId: null,
        email: 'admin@whatsomni.com',
        name: 'Master Platform SuperAdmin',
        role: 'superadmin',
        salt,
        passwordHash: adminHash,
        createdAt: '2026-06-01T00:00:00Z',
      },
      {
        id: 'usr-demo',
        tenantId: tenantId,
        workspaceId: workspaceId,
        email: 'demo@whatsomni.com',
        name: 'Alex Mercer (Account Owner)',
        role: 'owner',
        salt,
        passwordHash: adminHash,
        createdAt: '2026-08-10T00:00:00Z',
      },
    ];

    // 3. Channels (10 channels)
    this.data.channels = [
      {
        id: 'ch-wa-cloud',
        tenantId,
        workspaceId,
        type: 'whatsapp_cloud',
        name: 'WhatsApp Official Cloud API',
        accountHandle: '+1 (555) 019-2831',
        status: 'connected',
        badgeColor: 'emerald',
        unreadCount: 4,
        createdAt: '2026-08-11T00:00:00Z',
      },
      {
        id: 'ch-wa-baileys',
        tenantId,
        workspaceId,
        type: 'whatsapp_baileys',
        name: 'WhatsApp Baileys (QR Worker)',
        accountHandle: '+44 7700 900142',
        status: 'connected',
        badgeColor: 'green',
        unreadCount: 1,
        createdAt: '2026-08-11T00:00:00Z',
      },
      {
        id: 'ch-ig',
        tenantId,
        workspaceId,
        type: 'instagram',
        name: 'Instagram Direct & Media',
        accountHandle: '@whatsomni.official',
        status: 'connected',
        badgeColor: 'pink',
        unreadCount: 2,
        createdAt: '2026-08-12T00:00:00Z',
      },
      {
        id: 'ch-fb',
        tenantId,
        workspaceId,
        type: 'facebook',
        name: 'Facebook Messenger & Pages',
        accountHandle: 'WhatsOmni Global Business',
        status: 'connected',
        badgeColor: 'blue',
        unreadCount: 0,
        createdAt: '2026-08-12T00:00:00Z',
      },
      {
        id: 'ch-tiktok',
        tenantId,
        workspaceId,
        type: 'tiktok',
        name: 'TikTok Direct Messages & Video',
        accountHandle: '@whatsomni_tech',
        status: 'connected',
        badgeColor: 'stone',
        unreadCount: 1,
        createdAt: '2026-08-13T00:00:00Z',
      },
      {
        id: 'ch-linkedin',
        tenantId,
        workspaceId,
        type: 'linkedin',
        name: 'LinkedIn Company & Personal',
        accountHandle: 'WhatsOmni Enterprise Solutions',
        status: 'connected',
        badgeColor: 'sky',
        unreadCount: 0,
        createdAt: '2026-08-13T00:00:00Z',
      },
      {
        id: 'ch-telegram',
        tenantId,
        workspaceId,
        type: 'telegram',
        name: 'Telegram Bot & Broadcast',
        accountHandle: '@WhatsOmniSupportBot',
        status: 'connected',
        badgeColor: 'cyan',
        unreadCount: 3,
        createdAt: '2026-08-14T00:00:00Z',
      },
      {
        id: 'ch-sms',
        tenantId,
        workspaceId,
        type: 'sms',
        name: 'Multi-Gateway SMS (Twilio/Vonage)',
        accountHandle: '+1 (800) 555-OMNI',
        status: 'connected',
        badgeColor: 'amber',
        unreadCount: 0,
        createdAt: '2026-08-14T00:00:00Z',
      },
      {
        id: 'ch-email',
        tenantId,
        workspaceId,
        type: 'email',
        name: 'Two-Way Email (IMAP/SMTP)',
        accountHandle: 'support@whatsomni.com',
        status: 'connected',
        badgeColor: 'violet',
        unreadCount: 2,
        createdAt: '2026-08-15T00:00:00Z',
      },
      {
        id: 'ch-livechat',
        tenantId,
        workspaceId,
        type: 'livechat',
        name: 'Live Chat Website Widget',
        accountHandle: 'Widget ID: #omni-embed-992',
        status: 'connected',
        badgeColor: 'teal',
        unreadCount: 1,
        createdAt: '2026-08-15T00:00:00Z',
      },
    ];

    // 4. Contacts
    this.data.contacts = [
      {
        id: 'cont-1',
        tenantId,
        workspaceId,
        name: 'Tariq Mansoor',
        phone: '+971 50 123 4567',
        email: 'tariq.mansoor@emiratesgroup.ae',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        lifecycleStage: 'VIP',
        tags: ['CTWA Lead', 'High Intent', 'Enterprise'],
        source: 'Meta Ad #CTWA-2026',
        assignedAgent: 'Demo User',
        customFields: { Company: 'Mansoor Luxury Real Estate', City: 'Dubai', EstimatedBudget: '$45,000/yr' },
        createdAt: '2026-09-18T10:30:00Z',
      },
      {
        id: 'cont-2',
        tenantId,
        workspaceId,
        name: 'Sophie Dupont',
        phone: '+33 6 12 34 56 78',
        email: 'sophie.dupont@atelierfrance.fr',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        lifecycleStage: 'Customer',
        tags: ['Shopify Cart', 'WhatsApp Flow Form'],
        source: 'Shopify Storefront Webhook',
        assignedAgent: 'Sarah Connor',
        customFields: { Company: 'Atelier Dupont', City: 'Paris', LastOrder: '#ORD-8812' },
        createdAt: '2026-09-21T14:15:00Z',
      },
    ];

    // 5. Conversations & Messages
    this.data.conversations = [
      {
        id: 'conv-1',
        tenantId,
        workspaceId,
        contactId: 'cont-1',
        channel: 'whatsapp_cloud',
        status: 'open',
        assignedAgent: 'Demo User',
        lastMessage: 'Can you show me the Enterprise Flow Form preview for our team booking?',
        lastMessageTime: '10:42 AM',
        unreadCount: 1,
        createdAt: '2026-09-18T10:30:00Z',
      },
    ];

    this.data.messages = [
      {
        id: 'm1-1',
        tenantId,
        workspaceId,
        conversationId: 'conv-1',
        sender: 'customer',
        senderName: 'Tariq Mansoor',
        text: 'Hello! I saw your Click-to-WhatsApp ad on Instagram regarding WhatsOmni 3.0.',
        timestamp: '10:35 AM',
        channel: 'whatsapp_cloud',
        status: 'read',
      },
      {
        id: 'm1-2',
        tenantId,
        workspaceId,
        conversationId: 'conv-1',
        sender: 'agent',
        senderName: 'Demo User',
        text: 'Welcome Tariq! We support 10 messaging networks in one real-time shared inbox with native WhatsApp Flow forms.',
        timestamp: '10:38 AM',
        channel: 'whatsapp_cloud',
        status: 'read',
      },
    ];

    // 6. Meta Ads
    this.data.campaigns = [
      {
        id: 'ad-101',
        tenantId,
        workspaceId,
        name: 'CTWA Flash Sale: Autumn E-Commerce Funnel',
        platform: 'both',
        headline: 'Chat on WhatsApp to Claim 25% Off VIP Voucher',
        primaryText: 'Experience seamless shopping directly in your WhatsApp chat. Tap below to launch your private catalog & cart!',
        callToAction: 'Send WhatsApp Message',
        budgetDaily: 150,
        currency: 'USD',
        status: 'active',
        impressions: 48920,
        clicks: 3410,
        spend: 1240.5,
        leadsCaptured: 890,
        conversationsStarted: 924,
        ctwaTriggerKeyword: '#AUTUMN25',
        targetFlowId: 'flow-ecommerce-cart',
      },
    ];

    // 7. CRM Deals
    this.data.deals = [
      {
        id: 'deal-1',
        tenantId,
        workspaceId,
        title: 'Enterprise Multi-Workspace 50 Seats',
        contactName: 'Tariq Mansoor',
        contactPhone: '+971 50 123 4567',
        stage: 'Negotiation',
        value: 12500,
        currency: 'USD',
        assignedAgent: 'Demo User',
        expectedCloseDate: '2026-10-15',
        createdAt: '2026-09-20',
      },
    ];

    // 8. Gateways & Currencies
    this.data.currencies = [
      { code: 'USD', symbol: '$', name: 'US Dollar', exchangeRateToUSD: 1.0, isDefault: true, isActive: true },
      { code: 'EUR', symbol: '€', name: 'Euro', exchangeRateToUSD: 0.92, isDefault: false, isActive: true },
      { code: 'GBP', symbol: '£', name: 'British Pound', exchangeRateToUSD: 0.79, isDefault: false, isActive: true },
      { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal', exchangeRateToUSD: 3.75, isDefault: false, isActive: true },
      { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', exchangeRateToUSD: 3.67, isDefault: false, isActive: true },
      { code: 'EGP', symbol: 'ج.م', name: 'Egyptian Pound', exchangeRateToUSD: 48.5, isDefault: false, isActive: true },
      { code: 'INR', symbol: '₹', name: 'Indian Rupee', exchangeRateToUSD: 83.9, isDefault: false, isActive: true },
      { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', exchangeRateToUSD: 5.45, isDefault: false, isActive: true },
    ];

    this.data.paymentGateways = [
      { id: 'gw-stripe', name: 'Stripe', mode: 'live', enabled: true, region: 'Global Cards, Apple Pay' },
      { id: 'gw-paypal', name: 'PayPal', mode: 'live', enabled: true, region: 'Global Subscriptions & Smart Buttons' },
      { id: 'gw-razorpay', name: 'Razorpay', mode: 'live', enabled: true, region: 'India UPI, NetBanking' },
      { id: 'gw-paddle', name: 'Paddle', mode: 'live', enabled: true, region: 'Merchant of Record MoR' },
      { id: 'gw-mercadopago', name: 'Mercado Pago', mode: 'live', enabled: true, region: 'LATAM Pix / Boleto' },
      { id: 'gw-myfatoorah', name: 'MyFatoorah', mode: 'live', enabled: true, region: 'GCC: KNET, Mada, Apple Pay' },
      { id: 'gw-paystack', name: 'Paystack', mode: 'live', enabled: true, region: 'Nigeria, South Africa, Kenya' },
      { id: 'gw-flutterwave', name: 'Flutterwave', mode: 'live', enabled: true, region: 'Pan-African Multi-Currency' },
    ];
  }

  public getTable<K extends keyof DatabaseSchema>(tableName: K): DatabaseSchema[K] {
    return this.data[tableName];
  }

  public query<K extends keyof DatabaseSchema>(
    tableName: K,
    predicate: (item: any) => boolean
  ): any[] {
    return (this.data[tableName] || []).filter(predicate);
  }

  public findOne<K extends keyof DatabaseSchema>(
    tableName: K,
    predicate: (item: any) => boolean
  ): any | null {
    return (this.data[tableName] || []).find(predicate) || null;
  }

  public insert<K extends keyof DatabaseSchema>(
    tableName: K,
    record: any
  ): any {
    if (!record.id) {
      record.id = `${tableName.slice(0, 4)}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    }
    if (!record.createdAt) {
      record.createdAt = new Date().toISOString();
    }
    this.data[tableName].push(record);
    this.scheduleFlush();

    if (this.postgresAdapter?.isHealthy().connected) {
      this.postgresAdapter.insertRecord(tableName as string, record).catch((err) => {
        console.warn(`[DatabaseStore] PostgreSQL write-through error (${String(tableName)}):`, err.message);
      });
    }

    return record;
  }

  public update<K extends keyof DatabaseSchema>(
    tableName: K,
    predicate: (item: any) => boolean,
    updates: Partial<any>
  ): any | null {
    const item = (this.data[tableName] || []).find(predicate);
    if (!item) return null;
    Object.assign(item, updates, { updatedAt: new Date().toISOString() });
    this.scheduleFlush();

    if (this.postgresAdapter?.isHealthy().connected && item) {
      this.postgresAdapter.updateRecord(tableName as string, item.id, item.tenantId || 'ten-1', updates).catch((err) => {
        console.warn(`[DatabaseStore] PostgreSQL write-through error (${String(tableName)}):`, err.message);
      });
    }

    return item;
  }

  public delete<K extends keyof DatabaseSchema>(
    tableName: K,
    predicate: (item: any) => boolean
  ): boolean {
    const initialLen = this.data[tableName].length;
    const itemsToDelete = (this.data[tableName] || []).filter(predicate);
    this.data[tableName] = this.data[tableName].filter((x) => !predicate(x));
    const deleted = this.data[tableName].length < initialLen;
    if (deleted) {
      this.scheduleFlush();
      if (this.postgresAdapter?.isHealthy().connected && itemsToDelete.length > 0) {
        for (const item of itemsToDelete) {
          this.postgresAdapter.deleteRecord(tableName as string, item.id, item.tenantId || 'ten-1').catch((err) => {
            console.warn(`[DatabaseStore] PostgreSQL write-through error (${String(tableName)}):`, err.message);
          });
        }
      }
    }
    return deleted;
  }

  private scheduleFlush() {
    if (this.writeTimeout) return;
    this.writeTimeout = setTimeout(() => {
      this.writeTimeout = null;
      this.flushSync();
    }, 200);
  }

  public flushSync() {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Failed to flush database to disk:', err);
    }
  }

  public getStorageMode(): string {
    return process.env.DATA_STORE_MODE || 'json';
  }

  public getPostgresAdapter(): PostgresStorageAdapter | null {
    return this.postgresAdapter;
  }

  public setPostgresAdapter(adapter: PostgresStorageAdapter): void {
    this.postgresAdapter = adapter;
  }

  public getTotalRecordCount(): number {
    return this.isHealthy().records;
  }

  public isHealthy(): { ok: boolean; tables: number; records: number; diskSync: boolean; storageMode: string; postgresConnected: boolean } {
    let totalRecords = 0;
    for (const key of Object.keys(this.data) as (keyof DatabaseSchema)[]) {
      totalRecords += Array.isArray(this.data[key]) ? this.data[key].length : 0;
    }
    return {
      ok: this.isLoaded && fs.existsSync(DB_FILE),
      tables: Object.keys(this.data).length,
      records: totalRecords,
      diskSync: fs.existsSync(DB_FILE),
      storageMode: process.env.DATA_STORE_MODE || 'json',
      postgresConnected: !!this.postgresAdapter?.isHealthy().connected,
    };
  }
}

export const db = new DatabaseStore();
