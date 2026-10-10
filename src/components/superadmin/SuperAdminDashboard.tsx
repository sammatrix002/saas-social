import React, { useState } from 'react';
import {
  TenantWorkspace,
  PaymentGatewayConfig,
  CurrencyConfig,
  SubscriptionPlan,
  SuperAdminTab,
  AppMode,
} from '../../types.ts';
import {
  Shield,
  Layers,
  CreditCard,
  Globe,
  Key,
  Mail,
  HelpCircle,
  TrendingUp,
  DollarSign,
  Users,
  Server,
  Activity,
  CheckCircle2,
  ExternalLink,
  LogIn,
  Sliders,
  Send,
  Lock,
  Zap,
} from 'lucide-react';

interface SuperAdminDashboardProps {
  tenants: TenantWorkspace[];
  paymentGateways: PaymentGatewayConfig[];
  currencies: CurrencyConfig[];
  plans: SubscriptionPlan[];
  onImpersonateTenant: (tenant: TenantWorkspace) => void;
  onUpdateGatewayMode: (id: string, mode: 'live' | 'test') => void;
  onUpdateCurrencyRate: (code: string, newRate: number) => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  tenants,
  paymentGateways,
  currencies,
  plans,
  onImpersonateTenant,
  onUpdateGatewayMode,
  onUpdateCurrencyRate,
}) => {
  const [activeTab, setActiveTab] = useState<SuperAdminTab>('overview');
  const [aiOperationalMode, setAiOperationalMode] = useState<'master' | 'byok' | 'hybrid'>('hybrid');
  const [metaAppMode, setMetaAppMode] = useState<'admin_central' | 'byok_tenant'>('admin_central');
  const [testEmailTo, setTestEmailTo] = useState('admin@whatsomni.com');
  const [testEmailSent, setTestEmailSent] = useState(false);

  // Feature routing matrix
  const [featureRouting, setFeatureRouting] = useState({
    chatbots: 'Claude 3.5 Sonnet / GPT-4o',
    promptToFlow: 'GPT-4o',
    socialCopywriter: 'Gemini 3.8 Flash',
    flowAiNodes: 'Llama 3.3 70B (Groq)',
    ragEmbeddings: 'Gemini text-embedding-004',
    smartInboxReply: 'Groq LPU Engine',
  });

  const handleTestEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setTestEmailSent(true);
    setTimeout(() => setTestEmailSent(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Super Admin Header */}
      <div className="bg-[#10182A] border border-[#1E2B45] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              Super Admin SaaS Control Plane
            </span>
            <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded font-mono border border-amber-500/20">
              admin@whatsomni.com
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Platform Governance & Multi-Tenant Infrastructure
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            End-to-end governance over workspaces, 8 payment gateways, currencies, AI model vault, and Meta Embedded Signup.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-2 rounded-xl bg-[#0A1020] border border-[#1E2B45] text-emerald-400 text-xs font-mono font-bold flex items-center gap-2 shadow-sm">
            <Activity className="w-4 h-4" />
            <span>Reverb WebSocket 99.95% SLA</span>
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0A1020] border border-[#1E2B45] overflow-x-auto no-scrollbar shadow-sm">
        {[
          { id: 'overview', label: 'Platform Telemetry', icon: Activity },
          { id: 'tenants', label: 'Tenants & Impersonation', icon: Layers },
          { id: 'payment_gateways', label: '8 Payment Gateways', icon: CreditCard },
          { id: 'multi_currency', label: 'Multi-Currency & GeoIP', icon: Globe },
          { id: 'ai_vault', label: 'Central AI Vault & Models', icon: Key },
          { id: 'meta_app', label: 'Meta Embedded Signup', icon: Zap },
          { id: 'system_mailer', label: 'System Mailer (SMTP)', icon: Mail },
          { id: 'support_tickets', label: 'Support Helpdesk', icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-emerald-500 text-white font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-[#10182A]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Platform Telemetry & Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Monthly Recurring Revenue (MRR)</span>
              </div>
              <div className="text-2xl font-bold text-white tabular-nums">$48,250</div>
              <div className="text-[10px] text-emerald-400 mt-1">ARR: $579,000 (+24% MoM)</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Active Workspaces</span>
              </div>
              <div className="text-2xl font-bold text-white tabular-nums">1,280</div>
              <div className="text-[10px] text-slate-500 mt-1">Across 84 Migrated DB Schemas</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-amber-400" />
                <span>Redis Queue Depth</span>
              </div>
              <div className="text-2xl font-bold text-white tabular-nums">0 Tasks</div>
              <div className="text-[10px] text-emerald-400 mt-1">Nominal background queue</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                <span>Active Payment Gateways</span>
              </div>
              <div className="text-2xl font-bold text-white tabular-nums">8 Gateways</div>
              <div className="text-[10px] text-emerald-400 mt-1">Stripe, MyFatoorah, Paddle + 5 more</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                System Infrastructure Status
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Laravel Reverb WebSocket (Port 8080)</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
                  </span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Node.js Baileys WhatsApp Worker (Port 5001)</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Running
                  </span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">MySQL Database (84 Migrations Applied)</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Synced
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Platform Security & Architecture
              </h3>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  🛡 SSRF UrlSecurityValidator active: private subnets and 169.254.169.254 blocked.
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  🔒 Multi-Workspace IDOR isolation enforced at Eloquent ORM layer with dynamic tenant scoping.
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  🔑 Credentials encrypted at rest with AES-256-CBC.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Tenants Directory & Impersonation */}
      {activeTab === 'tenants' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Registered Multi-Tenant Workspaces</h2>
            <span className="text-xs text-slate-400">{tenants.length} Workspaces Managed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Workspace Name & Slug</th>
                  <th className="p-3.5">Account Owner</th>
                  <th className="p-3.5">Subscription Tier</th>
                  <th className="p-3.5">Channels</th>
                  <th className="p-3.5">Team Seats</th>
                  <th className="p-3.5">Tokens Used</th>
                  <th className="p-3.5 text-right">Audit Impersonation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {tenants.map((ten) => (
                  <tr key={ten.id} className="hover:bg-slate-850">
                    <td className="p-3.5">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{ten.name}</span>
                        <span className={`w-2 h-2 rounded-full ${ten.status === 'active' ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">/{ten.slug}</div>
                    </td>
                    <td className="p-3.5 font-mono">{ten.ownerEmail}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400">
                        {ten.planId.replace('plan-', '')}
                      </span>
                    </td>
                    <td className="p-3.5 tabular-nums">{ten.channelCount} Connected</td>
                    <td className="p-3.5 tabular-nums">
                      <span className="font-mono text-emerald-400">{ten.copilotCreditsRemaining}</span> Credits
                    </td>
                    <td className="p-3.5 tabular-nums font-mono text-cyan-400">
                      {ten.tokensConsumedTotal.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          const additional = prompt(`Add AI Copilot Credits for ${ten.name}:`, '500');
                          if (additional && !isNaN(Number(additional))) {
                            ten.copilotCreditsRemaining += Number(additional);
                            alert(`Added ${additional} credits to ${ten.name}!`);
                          }
                        }}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold"
                      >
                        + Credits
                      </button>
                      <button
                        onClick={() => onImpersonateTenant(ten)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                        title="Launch secure audit-logged session impersonation"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Impersonate</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: 8 Payment Gateways Management */}
      {activeTab === 'payment_gateways' && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paymentGateways.map((gw) => (
              <div
                key={gw.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xl space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-white">{gw.name}</h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        gw.mode === 'live' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-300'
                      }`}
                    >
                      {gw.mode}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    {gw.region}
                  </p>
                  <div className="space-y-1 text-[11px] text-slate-300">
                    <div className="text-slate-500">Supported Methods:</div>
                    <div className="text-[10px] font-mono text-cyan-400">{gw.supportedMethods.join(', ')}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => onUpdateGatewayMode(gw.id, gw.mode === 'live' ? 'test' : 'live')}
                    className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    Switch to {gw.mode === 'live' ? 'Test' : 'Live'}
                  </button>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Multi-Currency & GeoIP Localization */}
      {activeTab === 'multi_currency' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Multi-Currency & GeoIP Localization Engine</h2>
              <p className="text-xs text-slate-400">Automatic visitor GeoIP detection routes to native localized currency</p>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded font-mono">
              GeoIP Ingress Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Currency Code</th>
                  <th className="p-3.5">Symbol</th>
                  <th className="p-3.5">Currency Name</th>
                  <th className="p-3.5">Exchange Rate to USD</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Edit Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {currencies.map((curr) => (
                  <tr key={curr.code} className="hover:bg-slate-850">
                    <td className="p-3.5 font-bold font-mono text-emerald-400">{curr.code}</td>
                    <td className="p-3.5 font-bold text-white">{curr.symbol}</td>
                    <td className="p-3.5">{curr.name}</td>
                    <td className="p-3.5 font-mono tabular-nums">{curr.exchangeRateToUSD}</td>
                    <td className="p-3.5">
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">
                        {curr.isDefault ? 'Default' : 'Active'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          const newRate = prompt(`Enter new exchange rate for ${curr.code} to USD:`, String(curr.exchangeRateToUSD));
                          if (newRate && !isNaN(Number(newRate))) {
                            onUpdateCurrencyRate(curr.code, Number(newRate));
                          }
                        }}
                        className="text-xs text-cyan-400 hover:underline"
                      >
                        Adjust Rate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Central AI Vault & 3 Operational Models */}
      {activeTab === 'ai_vault' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white">Central Platform AI Vault & Operational Modes</h2>
            <p className="text-xs text-slate-400">Choose how AI costs and LLM inference are governed across your SaaS</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { id: 'master', title: '1. Master Managed Model', desc: 'Platform owner supplies central master keys. Tenants have zero setup governed by token limits.' },
              { id: 'byok', title: '2. Bring Your Own Key (BYOK)', desc: 'Tenants provide their own API keys. Platform incurs $0 AI cost; tenants have full model freedom.' },
              { id: 'hybrid', title: '3. Flexible / Hybrid Model', desc: 'Bundled token allowances on premium tiers, with seamless failover to tenant BYOK keys on quota exceeded.' },
            ].map((m) => (
              <div
                key={m.id}
                onClick={() => setAiOperationalMode(m.id as any)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  aiOperationalMode === m.id
                    ? 'border-emerald-500 bg-emerald-950/20 shadow-md'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-white">{m.title}</h4>
                  {aiOperationalMode === m.id && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Master Platform Feature Routing Matrix
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(featureRouting).map(([feat, model]) => (
                <div key={feat} className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 capitalize">{feat.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-mono text-cyan-400 text-[11px]">{model}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Meta Embedded Signup Configuration */}
      {activeTab === 'meta_app' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 max-w-3xl">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white">Central Meta Developer App & Embedded Signup</h2>
            <p className="text-xs text-slate-400">Allows tenants to connect WhatsApp Cloud API, Instagram, and Facebook Messenger via official 1-click popup dialog</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Meta App ID</label>
              <input
                type="text"
                defaultValue="982341209384910"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Meta App Secret</label>
              <input
                type="password"
                defaultValue="a8f90b12c89012398412"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Meta Embedded Signup Config ID</label>
              <input
                type="text"
                defaultValue="12890471209384"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-emerald-400"
              />
            </div>

            <button
              onClick={() => alert('Meta Embedded Signup configuration saved and verified with Meta Graph API!')}
              className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs shadow-md"
            >
              Save Meta App Configuration
            </button>
          </div>
        </div>
      )}

      {/* Tab 7: System Mailer (SMTP / Resend API) */}
      {activeTab === 'system_mailer' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 max-w-3xl">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white">System Transactional Mailer</h2>
            <p className="text-xs text-slate-400">SMTP and Resend API delivery engine with mandatory live test validation</p>
          </div>

          <form onSubmit={handleTestEmail} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">SMTP Host</label>
                <input
                  type="text"
                  defaultValue="smtp.postmarkapp.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">SMTP Port</label>
                <input
                  type="text"
                  defaultValue="587 (TLS)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Dispatch Live Test Email To</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={testEmailTo}
                  onChange={(e) => setTestEmailTo(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test Email</span>
                </button>
              </div>
            </div>

            {testEmailSent && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Test message dispatched successfully to {testEmailTo}! SMTP handshake verified.</span>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Tab 8: Support Desk */}
      {activeTab === 'support_tickets' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Tenant Helpdesk & Support Tickets</h2>
            <span className="text-xs text-slate-400">3 Open Tickets</span>
          </div>

          <div className="divide-y divide-slate-800/60 text-xs">
            {[
              { id: 'TICK-901', tenant: 'Acme Global Commerce', title: 'Requesting webhook throughput increase for Flash Sale', priority: 'High', date: '2 hours ago' },
              { id: 'TICK-902', tenant: 'Luxe Fragrance Paris', title: 'Assistance with MyFatoorah gateway live mode webhook testing', priority: 'Medium', date: '5 hours ago' },
              { id: 'TICK-903', tenant: 'Starlight Digital Agency', title: 'Adding 20 additional staff seats to enterprise plan', priority: 'Low', date: 'Yesterday' },
            ].map((t) => (
              <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-850">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white">{t.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      t.priority === 'High' ? 'bg-rose-500/15 text-rose-400' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Tenant: <strong className="text-slate-300">{t.tenant}</strong> · Submitted: {t.date}
                  </div>
                </div>
                <button
                  onClick={() => alert(`Replied to ticket ${t.id}`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
                >
                  Reply & Resolve
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
