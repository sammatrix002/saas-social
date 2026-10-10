import React, { useState } from 'react';
import { MetaAdCampaign } from '../../types.ts';
import {
  TrendingUp,
  Plus,
  DollarSign,
  MessageSquare,
  Users,
  Smartphone,
  CheckCircle2,
  ExternalLink,
  Layers,
  ArrowRight,
  Filter,
  Eye,
  Sparkles,
  Zap,
} from 'lucide-react';
import { PageHeader } from '../ui/PageHeader.tsx';
import { KPIGrid } from '../ui/KPIGrid.tsx';
import { KPICard } from '../ui/KPICard.tsx';
import { CampaignTable } from './CampaignTable.tsx';
import { FunnelVisualization } from './FunnelVisualization.tsx';
import { MobileAdMockup } from './MobileAdMockup.tsx';

interface MetaAdsManagerProps {
  campaigns: MetaAdCampaign[];
  onCreateCampaign: (camp: MetaAdCampaign) => void;
  onToggleStatus: (id: string) => void;
}

export const MetaAdsManager: React.FC<MetaAdsManagerProps> = ({
  campaigns,
  onCreateCampaign,
  onToggleStatus,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [previewPlatform, setPreviewPlatform] = useState<'facebook' | 'instagram'>('facebook');
  const [selectedCampaignForPreview, setSelectedCampaignForPreview] = useState<MetaAdCampaign | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('Chat on WhatsApp to Claim 25% Off VIP Voucher');
  const [primaryText, setPrimaryText] = useState(
    'Experience zero friction shopping directly inside your WhatsApp chat. Tap below to launch your personal catalog & checkout!'
  );
  const [budgetDaily, setBudgetDaily] = useState(150);
  const [platform, setPlatform] = useState<'facebook' | 'instagram' | 'both'>('both');
  const [ctwaTriggerKeyword, setCtwaTriggerKeyword] = useState('#AUTUMN25');
  const [targetFlowId, setTargetFlowId] = useState('flow-ecommerce-cart');
  const [mediaUrl, setMediaUrl] = useState(
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
  );

  // Dynamic metrics calculation
  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalLeads = campaigns.reduce((acc, c) => acc + c.leadsCaptured, 0);
  const totalConversations = campaigns.reduce((acc, c) => acc + c.conversationsStarted, 0);
  const avgCostPerLead = totalLeads > 0 ? (totalSpend / totalLeads).toFixed(2) : '1.66';

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCamp: MetaAdCampaign = {
      id: `ad-${Date.now()}`,
      name: name || 'Click-to-WhatsApp Promotion',
      platform,
      headline,
      primaryText,
      callToAction: 'Send WhatsApp Message',
      budgetDaily,
      currency: 'USD',
      status: 'active',
      impressions: 0,
      clicks: 0,
      spend: 0,
      leadsCaptured: 0,
      conversationsStarted: 0,
      ctwaTriggerKeyword,
      targetFlowId,
      mediaUrl,
    };
    onCreateCampaign(newCamp);
    setShowCreateModal(false);
    setName('');
  };

  const activePreviewCampaign = selectedCampaignForPreview || campaigns[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <PageHeader
        title="Meta Ads & Click-to-WhatsApp (CTWA) Engine"
        subtitle="Ingest Meta Ad clicks directly into high-converting WhatsApp automation funnels with zero drop-off."
        badgeText="Graph API v21.0"
        ctaText="Launch New Meta Ad Campaign"
        onCtaClick={() => setShowCreateModal(true)}
      />

      {/* 2. 4 Horizontal KPI Cards */}
      <KPIGrid columns={4}>
        <KPICard
          label="Total Ad Spend"
          value={totalSpend > 0 ? totalSpend : 3880.5}
          prefix="$"
          description="Direct to Meta Ads Manager"
          icon={DollarSign}
          iconColor="emerald"
        />

        <KPICard
          label="CTWA Conversations"
          value={totalConversations > 0 ? totalConversations : 2374}
          secondaryMetric="94.2% Funnel Open Rate"
          isPositive={true}
          icon={MessageSquare}
          iconColor="cyan"
        />

        <KPICard
          label="Qualified Ingested Leads"
          value={totalLeads > 0 ? totalLeads : 2340}
          description="Added to CRM Pipeline"
          icon={Users}
          iconColor="purple"
        />

        <KPICard
          label="Avg Cost Per Lead (CPL)"
          value={avgCostPerLead}
          prefix="$"
          secondaryMetric="3.2× Lower than Web Landing Forms"
          isPositive={true}
          icon={TrendingUp}
          iconColor="emerald"
        />
      </KPIGrid>

      {/* 3. Large Enterprise Data Table Card */}
      <CampaignTable
        campaigns={campaigns}
        onToggleStatus={onToggleStatus}
        onSelectCampaign={(c) => setSelectedCampaignForPreview(c)}
      />

      {/* 4. Live Ad Simulation Funnel & Smartphone Simulator */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pt-2 items-start">
        <div className="xl:col-span-7">
          <FunnelVisualization activeCampaign={activePreviewCampaign} />
        </div>
        <div className="xl:col-span-5">
          <MobileAdMockup campaign={activePreviewCampaign} />
        </div>
      </div>

      {/* 5. Create New Meta Ad Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#10182A] border border-[#1E2B45] rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#1E2B45] mb-5">
              <div>
                <h3 className="text-base font-bold text-white">
                  Launch New Click-to-WhatsApp Campaign
                </h3>
                <p className="text-xs text-slate-400">
                  Configure Meta Ad creative, trigger keyword, and automated WhatsApp target flow
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#0A1020] border border-[#1E2B45]"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Campaign Title</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. VIP Autumn Flash Sale - WhatsApp Direct"
                  required
                  className="w-full bg-[#070B14] border border-[#1E2B45] rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full bg-[#070B14] border border-[#1E2B45] rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Daily Budget (USD)
                  </label>
                  <input
                    type="number"
                    value={budgetDaily}
                    onChange={(e) => setBudgetDaily(Number(e.target.value))}
                    className="w-full bg-[#070B14] border border-[#1E2B45] rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Primary Ad Copy</label>
                <textarea
                  value={primaryText}
                  onChange={(e) => setPrimaryText(e.target.value)}
                  rows={3}
                  className="w-full bg-[#070B14] border border-[#1E2B45] rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className="w-full bg-[#070B14] border border-[#1E2B45] rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="both">Both (Facebook & Instagram)</option>
                    <option value="facebook">Facebook Feed Only</option>
                    <option value="instagram">Instagram Stories Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    CTWA Keyword Trigger
                  </label>
                  <input
                    type="text"
                    value={ctwaTriggerKeyword}
                    onChange={(e) => setCtwaTriggerKeyword(e.target.value)}
                    placeholder="#OFFER"
                    className="w-full bg-[#070B14] border border-[#1E2B45] rounded-xl p-2.5 text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Target Flow Target
                  </label>
                  <input
                    type="text"
                    value={targetFlowId}
                    onChange={(e) => setTargetFlowId(e.target.value)}
                    className="w-full bg-[#070B14] border border-[#1E2B45] rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#1E2B45]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#0A1020] text-slate-300 border border-[#1E2B45] hover:bg-[#141E34]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                >
                  Publish Campaign to Meta Graph API
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
