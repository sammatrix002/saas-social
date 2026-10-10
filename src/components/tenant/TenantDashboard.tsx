import React from 'react';
import {
  TenantWorkspace,
  ChannelInfo,
  Conversation,
  MetaAdCampaign,
  CrmDeal,
} from '../../types.ts';
import {
  MessageSquare,
  TrendingUp,
  Users,
  Workflow,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Plus,
  DollarSign,
  Zap,
} from 'lucide-react';
import { PageHeader } from '../ui/PageHeader.tsx';
import { KPIGrid } from '../ui/KPIGrid.tsx';
import { KPICard } from '../ui/KPICard.tsx';
import { DataCard } from '../ui/DataCard.tsx';
import { StatusBadge } from '../ui/StatusBadge.tsx';

interface TenantDashboardProps {
  workspace: TenantWorkspace;
  channels: ChannelInfo[];
  conversations: Conversation[];
  campaigns: MetaAdCampaign[];
  deals: CrmDeal[];
  onNavigateTab: (tab: any) => void;
}

export const TenantDashboard: React.FC<TenantDashboardProps> = ({
  workspace,
  channels,
  conversations,
  campaigns,
  deals,
  onNavigateTab,
}) => {
  const totalLeads = campaigns.reduce((acc, c) => acc + c.leadsCaptured, 0);
  const totalDealsValue = deals.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <PageHeader
        title={workspace.name}
        subtitle="Unified Customer Engagement, Click-to-WhatsApp Funnels & Conversational Sales Engine"
        badgeText={`PLAN: ${workspace.planId.replace('plan-', '').toUpperCase()}`}
        ctaText="Launch Meta Ad"
        onCtaClick={() => onNavigateTab('ctwa_ads')}
        secondaryActions={
          <button
            onClick={() => onNavigateTab('inbox')}
            className="px-3.5 py-2.5 rounded-xl bg-[#0A1020] hover:bg-[#10182A] text-slate-200 border border-[#1E2B45] text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Open Shared Inbox</span>
          </button>
        }
      />

      {/* 2. KPI Cards */}
      <KPIGrid columns={4}>
        <KPICard
          label="Total Leads Captured"
          value={totalLeads > 0 ? totalLeads : 2340}
          secondaryMetric="From 10 Omnichannel Networks"
          isPositive={true}
          icon={Users}
          iconColor="emerald"
        />

        <KPICard
          label="Active CRM Pipeline"
          value={totalDealsValue > 0 ? totalDealsValue : 48500}
          prefix="$"
          description={`${deals.length} active sales deals`}
          icon={DollarSign}
          iconColor="cyan"
        />

        <KPICard
          label="Conversations Ingested"
          value={conversations.length * 280 + 340}
          secondaryMetric="98.4% CSAT Rating"
          isPositive={true}
          icon={MessageSquare}
          iconColor="purple"
        />

        <KPICard
          label="Active Channels"
          value={channels.filter((c) => c.status === 'connected').length}
          suffix="/10"
          secondaryMetric="All Gateways Operational"
          isPositive={true}
          icon={Zap}
          iconColor="emerald"
        />
      </KPIGrid>

      {/* 3. Channels Quick Health Matrix */}
      <DataCard
        title="Omnichannel Networks Health & Latency"
        badge="10 Channels Configured"
        actions={
          <button
            onClick={() => onNavigateTab('inbox')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            <span>View All in Inbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        }
      >
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {channels.map((ch) => (
            <div
              key={ch.id}
              onClick={() => onNavigateTab('inbox')}
              className="p-3.5 rounded-xl bg-[#0A1020] border border-[#1E2B45] hover:border-emerald-500/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-slate-400 group-hover:text-emerald-400 transition-colors">
                  {ch.unreadCount} unread
                </span>
              </div>
              <div className="text-xs font-bold text-white truncate">{ch.name}</div>
              <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                {ch.accountHandle}
              </div>
            </div>
          ))}
        </div>
      </DataCard>

      {/* 4. Two Column Insights: Recent Inquiries & Quick Funnels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inbound Leads */}
        <DataCard
          title="Recent High-Intent Inquiries"
          badge="Real-Time"
          actions={
            <button
              onClick={() => onNavigateTab('inbox')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          }
        >
          <div className="space-y-2.5">
            {conversations.slice(0, 4).map((c) => (
              <div
                key={c.id}
                onClick={() => onNavigateTab('inbox')}
                className="p-3 rounded-xl bg-[#0A1020] border border-[#1E2B45] hover:bg-[#141E34] transition-colors cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                    WA
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-white truncate">{c.lastMessage}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="capitalize">{c.channel.replace('_', ' ')}</span>
                      <span>·</span>
                      <span>{c.lastMessageTime}</span>
                    </div>
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </DataCard>

        {/* Quick Launch & Enterprise Workflows */}
        <DataCard title="Enterprise Accelerators & Shortcuts" badge="Instant Deploy">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onNavigateTab('flow_forms')}
              className="p-4 rounded-xl bg-[#0A1020] border border-[#1E2B45] hover:border-emerald-500/40 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Workflow className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-300">
                Native WhatsApp Flows
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Deploy 0% drop-off booking & KYC forms
              </p>
            </button>

            <button
              onClick={() => onNavigateTab('flow_builder')}
              className="p-4 rounded-xl bg-[#0A1020] border border-[#1E2B45] hover:border-purple-500/40 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white group-hover:text-purple-300">
                AI Prompt-to-Flow
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Generate 19-node automation graphs
              </p>
            </button>

            <button
              onClick={() => onNavigateTab('catalog')}
              className="p-4 rounded-xl bg-[#0A1020] border border-[#1E2B45] hover:border-cyan-500/40 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                In-Chat Catalog & Cart
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                1-click checkout with 8 payment gateways
              </p>
            </button>

            <button
              onClick={() => onNavigateTab('crm_deals')}
              className="p-4 rounded-xl bg-[#0A1020] border border-[#1E2B45] hover:border-amber-500/40 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white group-hover:text-amber-300">
                Kanban Deals CRM
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Visual pipeline stages & contact sync
              </p>
            </button>
          </div>
        </DataCard>
      </div>
    </div>
  );
};
