import React, { useState } from 'react';
import {
  AppMode,
  SubscriptionPlan,
  CurrencyConfig,
} from '../../types.ts';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  CheckCircle2,
  Zap,
  Globe,
  MessageSquare,
  Bot,
  Send,
  Calendar,
  ShoppingBag,
  TrendingUp,
  BarChart3,
  Share2,
  Workflow,
  Lock,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Play,
  CreditCard,
} from 'lucide-react';

interface LandingPageProps {
  setMode: (mode: AppMode) => void;
  plans: SubscriptionPlan[];
  selectedCurrency: string;
  currencies: CurrencyConfig[];
  onQuickLogin: (role: 'admin' | 'tenant') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  setMode,
  plans,
  selectedCurrency,
  currencies,
  onQuickLogin,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [activeTab, setActiveTab] = useState<'inbox' | 'ctwa' | 'flows' | 'builder' | 'social'>('ctwa');

  const curr = currencies.find((c) => c.code === selectedCurrency) || currencies[0];

  const channelsList = [
    { name: 'WhatsApp Cloud API', desc: 'Meta Graph API v21.0 & Embedded Signup', color: 'from-emerald-600 to-green-500' },
    { name: 'WhatsApp Baileys QR', desc: 'Node.js persistent multi-device sockets', color: 'from-green-600 to-emerald-400' },
    { name: 'Instagram Direct', desc: '2-way DMs, Stories & Feed Publishing', color: 'from-pink-600 to-rose-400' },
    { name: 'Facebook Messenger', desc: 'Pages, Messenger & Feed Video', color: 'from-blue-600 to-indigo-400' },
    { name: 'TikTok Channel', desc: 'Direct Messages & 9:16 Vertical Video API', color: 'from-slate-700 to-slate-900' },
    { name: 'LinkedIn Channel', desc: 'Organization & Personal Posts Publishing', color: 'from-sky-600 to-blue-500' },
    { name: 'Telegram Bot', desc: 'BotFather token & broadcast channels', color: 'from-cyan-500 to-blue-400' },
    { name: 'Multi-Gateway SMS', desc: 'Twilio, Vonage, Plivo, MessageBird, Telnyx', color: 'from-amber-600 to-yellow-500' },
    { name: 'Two-Way Email', desc: 'RFC IMAP Inbound + SMTP Outbound', color: 'from-purple-600 to-violet-400' },
    { name: 'Live Chat Widget', desc: 'Real-time WebSocket Website Widget', color: 'from-teal-600 to-emerald-400' },
  ];

  const paymentGatewaysList = [
    { name: 'Stripe', region: 'Global Cards, Apple Pay, Portals' },
    { name: 'PayPal', region: 'Global Subscriptions & Smart Buttons' },
    { name: 'Razorpay', region: 'India UPI, NetBanking & Cards' },
    { name: 'Paddle', region: 'Merchant of Record (MoR) Auto VAT' },
    { name: 'Mercado Pago', region: 'LATAM, Brazil Pix, Boleto' },
    { name: 'MyFatoorah', region: 'Middle East & GCC (KNET, Mada, Benefit)' },
    { name: 'Paystack', region: 'Nigeria, Ghana, South Africa & Kenya' },
    { name: 'Flutterwave', region: 'Pan-African & International Multi-Currency' },
  ];

  return (
    <div className="min-h-full bg-[#070B14] text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden border-b border-[#1E2B45]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Version badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10182A] border border-emerald-500/30 text-xs text-slate-300 shadow-xl backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-emerald-400">WhatsOmni v3.0 Major Release</span>
              <span className="text-slate-500">·</span>
              <span>10 Channels & Meta CTWA Funnels</span>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center max-w-4xl mx-auto mb-8">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
              The Turnkey <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">AI Omnichannel SaaS</span>, CTWA Engine & Sales CRM
            </h1>
            <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Unify WhatsApp Cloud & Baileys, Instagram, TikTok, LinkedIn, and Telegram into a single real-time command center. Launch Click-to-WhatsApp funnels with native Flow forms and 8 global payment gateways.
            </p>
          </div>

          {/* Quick Demo Credentials Panel */}
          <div className="max-w-3xl mx-auto mb-10 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Interactive Demo Environments
                </span>
              </div>
              <span className="text-[11px] text-slate-400">1-Click Instant Login</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      Super Admin Control Plane
                    </span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded">Platform Owner</span>
                  </div>
                  <div className="text-xs font-mono text-slate-300 mb-1">Email: admin@whatsomni.com</div>
                  <div className="text-xs font-mono text-slate-400 mb-3">Password: Password123!</div>
                </div>
                <button
                  onClick={() => onQuickLogin('admin')}
                  className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Launch Super Admin Demo
                </button>
              </div>

              <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      Tenant Workspace Suite
                    </span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded">Customer Experience</span>
                  </div>
                  <div className="text-xs font-mono text-slate-300 mb-1">Email: demo@whatsomni.com</div>
                  <div className="text-xs font-mono text-slate-400 mb-3">Password: Password123!</div>
                </div>
                <button
                  onClick={() => onQuickLogin('tenant')}
                  className="w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Launch Tenant Workspace
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Feature Tour Tabs */}
          <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Tab navigation */}
            <div className="flex items-center gap-2 p-2 bg-slate-950 border-b border-slate-800 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('ctwa')}
                className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTab === 'ctwa'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Meta Ads & CTWA Engine
              </button>
              <button
                onClick={() => setActiveTab('inbox')}
                className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTab === 'inbox'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Shared Inbox & /Snippets
              </button>
              <button
                onClick={() => setActiveTab('flows')}
                className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTab === 'flows'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                WhatsApp Flow Forms
              </button>
              <button
                onClick={() => setActiveTab('builder')}
                className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTab === 'builder'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Workflow className="w-3.5 h-3.5" />
                Visual Flow Builder & AI
              </button>
              <button
                onClick={() => setActiveTab('social')}
                className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTab === 'social'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                Cross-Platform Social Scheduler
              </button>
            </div>

            {/* Tour Tab Content Showcase */}
            <div className="p-6">
              {activeTab === 'ctwa' && (
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Meta Marketing v21.0
                    </span>
                    <h3 className="text-2xl font-bold text-white mt-1 mb-3">
                      Launch Click-to-WhatsApp Ads Directly From Your Dashboard
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      Create, preview, and deploy high-converting Meta Ad campaigns across Facebook Mobile Feed and Instagram Stories. Incoming ad clicks are automatically funneled into interactive WhatsApp flows with lead attribution and CRM deal creation.
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Interactive live feed card previews (FB & IG formats)</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Zero ad markup: Spend paid directly to Meta Marketing API</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Real-time conversion ROI, CTR and lead capture tables</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setMode('tenant')}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-2"
                    >
                      <span>Explore CTWA Ads Manager</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Interactive Mockup */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-xs">
                      <span className="font-semibold text-slate-300">Facebook Mobile Feed Preview</span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Sponsored</span>
                    </div>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                        W
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">WhatsOmni Official</div>
                        <div className="text-[10px] text-slate-400">Automated Marketing · 10 min ago</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-200 mb-3 leading-relaxed">
                      Transform every ad impression into a closed sale. Tap below to chat directly with our sales team on WhatsApp and receive an instant 25% voucher.
                    </div>
                    <div className="rounded-lg overflow-hidden border border-slate-800 mb-3 bg-slate-900">
                      <img
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80"
                        alt="Meta Ad Preview"
                        className="w-full h-36 object-cover"
                      />
                      <div className="p-3 flex items-center justify-between bg-slate-900">
                        <div>
                          <div className="text-[11px] text-slate-400">WHATSAPP.COM</div>
                          <div className="text-xs font-bold text-white">Chat on WhatsApp to Claim VIP Voucher</div>
                        </div>
                        <span className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          Send Message
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'inbox' && (
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Laravel Reverb WebSockets
                    </span>
                    <h3 className="text-2xl font-bold text-white mt-1 mb-3">
                      Real-Time Omnichannel Shared Inbox & /Snippets
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      Consolidate 10 channels into one high-throughput stream. Restrict channels to specific agents, post internal yellow notes with @mentions, search canned response snippets with `/`, and insert AI smart replies with 1 click.
                    </p>
                    <button
                      onClick={() => setMode('tenant')}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-2"
                    >
                      <span>Open Live Inbox Demo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2">
                    <div className="text-emerald-400 font-bold">⚡ Live Channel Stream Active</div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-cyan-400">Tariq Mansoor (+971 50 123 4567):</span> "Can you show me the Enterprise Flow Form preview?"
                    </div>
                    <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-200">
                      <span className="text-emerald-400">Agent Demo User:</span> "Sent WhatsApp Flow form [Executive Booking]."
                    </div>
                    <div className="p-2 rounded bg-amber-950/40 border border-amber-800/40 text-amber-300 text-[11px]">
                      🔒 Internal Note: Lead is VIP qualified, potential closing within 7 days.
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'flows' && (
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Native WhatsApp Flow Forms
                    </span>
                    <h3 className="text-2xl font-bold text-white mt-1 mb-3">
                      0% Form Drop-Off Directly Inside WhatsApp Chats
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      Build and deploy multi-screen native JSON WhatsApp forms for appointment bookings, customer KYC verification, product inquiries, and CSAT surveys without external browser redirects.
                    </p>
                    <button
                      onClick={() => setMode('tenant')}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-2"
                    >
                      <span>Test Phone Simulator</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-64 bg-slate-900 border-4 border-slate-700 rounded-3xl p-3 shadow-2xl">
                      <div className="h-4 w-20 bg-slate-700 rounded-full mx-auto mb-3" />
                      <div className="bg-emerald-900/40 border border-emerald-500/30 rounded-xl p-3 text-xs text-white mb-3">
                        <div className="font-bold text-emerald-300 mb-1">WhatsApp Flow Form</div>
                        <div className="text-[11px] text-slate-300">Book Executive Consultation</div>
                      </div>
                      <div className="space-y-2 text-[11px]">
                        <div className="bg-slate-950 p-2 rounded border border-slate-800 text-slate-400">Service: Omnichannel Setup</div>
                        <div className="bg-slate-950 p-2 rounded border border-slate-800 text-slate-400">Date: 2026-10-15</div>
                        <div className="bg-emerald-600 text-center py-1.5 rounded font-bold text-white">Submit Natively</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'builder' && (
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Visual React Flow Canvas
                    </span>
                    <h3 className="text-2xl font-bold text-white mt-1 mb-3">
                      Drag-and-Drop Automation Flow Builder & AI Prompt-to-Flow
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      Compose intelligent bot interactions with 19+ node primitives. Type natural language requests like "Build an abandoned cart recovery flow with discount coupon" and our AI engine auto-generates the entire node graph in seconds.
                    </p>
                    <button
                      onClick={() => setMode('tenant')}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-2"
                    >
                      <span>Launch Flow Canvas</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
                    <div className="flex items-center gap-2 text-emerald-400 mb-2">
                      <Workflow className="w-4 h-4" />
                      <span>AI Prompt-to-Flow Active Canvas</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] mb-2">
                      [Trigger: Inbound #CTWA-2026] ➔ [Message: Welcome] ➔ [Interactive Menu: 3 Options] ➔ [WhatsApp Flow Form] ➔ [CRM Deal]
                    </div>
                    <div className="text-emerald-400 text-[11px]">✔ 5 Nodes Connected · Dry-Run Simulator Ready</div>
                  </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Multi-Network Publishing
                    </span>
                    <h3 className="text-2xl font-bold text-white mt-1 mb-3">
                      Cross-Platform Social Scheduler & AI Copywriter
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      Publish posts simultaneously across Facebook Pages, Instagram Accounts & Reels, TikTok Videos (9:16 vertical video API), LinkedIn, and Telegram channels with interactive live card preview mockups.
                    </p>
                    <button
                      onClick={() => setMode('tenant')}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-2"
                    >
                      <span>Compose & Schedule Posts</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                      <span className="font-bold text-white">Supported Networks</span>
                      <span className="text-emerald-400 text-[11px]">5 Networks Connected</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 bg-slate-900 rounded border border-slate-800">📷 Instagram Reels & Feed</div>
                      <div className="p-2 bg-slate-900 rounded border border-slate-800">🎵 TikTok 9:16 Video API</div>
                      <div className="p-2 bg-slate-900 rounded border border-slate-800">💼 LinkedIn Company Page</div>
                      <div className="p-2 bg-slate-900 rounded border border-slate-800">✈️ Telegram Broadcast</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 10 Connected Channels Grid */}
      <section className="py-16 border-b border-slate-900 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Omnichannel Architecture
            </span>
            <h2 className="text-3xl font-bold text-white mt-2 mb-3">
              10 Major Messaging Networks In One Unified Console
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              No more switching between separate tabs or mobile apps. Manage all conversations with channel-level team isolation and zero latency.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {channelsList.map((ch, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/40 p-4 rounded-xl flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {ch.name}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    {ch.desc}
                  </p>
                </div>
                <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded inline-block text-center">
                  Active & Synced
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Currency Dynamic Pricing Engine */}
      <section className="py-20 border-b border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Transparent Multi-Currency SaaS
            </span>
            <h2 className="text-3xl font-bold text-white mt-2 mb-3">
              Predictable Pricing Tailored For Every Scale
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mb-6">
              Supported in 8 global & regional currencies with automatic GeoIP detection and zero transaction markup.
            </p>

            {/* Monthly / Annual toggle */}
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {plans.map((p) => {
              const priceMap = billingCycle === 'annual' ? p.annualPrices : p.monthlyPrices;
              const price = priceMap[selectedCurrency] || priceMap.USD;

              return (
                <div
                  key={p.id}
                  className={`bg-slate-900 border rounded-2xl p-6 flex flex-col justify-between relative transition-all ${
                    p.badge
                      ? 'border-emerald-500 shadow-2xl shadow-emerald-500/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {p.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider shadow-md">
                      {p.badge}
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{p.name}</h3>
                    <p className="text-xs text-slate-400 mb-6">{p.tagline}</p>

                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-extrabold text-white tabular-nums">
                        {curr.symbol}{price}
                      </span>
                      <span className="text-xs text-slate-400">/ month</span>
                    </div>

                    <div className="space-y-3 mb-8">
                      {p.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onQuickLogin('tenant')}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                      p.badge
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    Start with {p.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8-Gateway Payment Grid */}
      <section className="py-16 border-b border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Global Monetization Infrastructure
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">
              8 Global & Regional Payment Gateways Built-In
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-5xl mx-auto">
            {paymentGatewaysList.map((gw, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{gw.name}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{gw.region}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-slate-950 text-slate-500 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-sm">WhatsOmni v3.0</span>
            <span>— Enterprise Omnichannel Customer Engagement SaaS</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onQuickLogin('admin')} className="hover:text-white transition-colors">
              Super Admin Mode
            </button>
            <button onClick={() => onQuickLogin('tenant')} className="hover:text-white transition-colors">
              Tenant Demo
            </button>
            <span>© 2026 WhatsOmni. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
