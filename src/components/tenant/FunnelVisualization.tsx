import React from 'react';
import { Eye, MessageSquare, Smartphone, Users, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { MetaAdCampaign } from '../../types.ts';

interface FunnelVisualizationProps {
  activeCampaign: MetaAdCampaign;
}

export const FunnelVisualization: React.FC<FunnelVisualizationProps> = ({
  activeCampaign,
}) => {
  const stages = [
    {
      step: '01',
      title: 'Meta Ad Impression',
      subtitle: 'FB & IG Feed Delivery',
      metric: `${activeCampaign.impressions.toLocaleString()} views`,
      subMetric: `${activeCampaign.clicks.toLocaleString()} clicks (7.0% CTR)`,
      icon: Eye,
      accent: 'blue',
      glowClass: 'shadow-[0_0_15px_rgba(59,130,246,0.25)]',
      borderClass: 'border-blue-500/30',
      badgeClass: 'bg-blue-500/10 text-blue-400',
    },
    {
      step: '02',
      title: 'WhatsApp Inbound Trigger',
      subtitle: 'Deep-Linked Keyword',
      metric: `${activeCampaign.conversationsStarted.toLocaleString()} chats`,
      subMetric: `Trigger: ${activeCampaign.ctwaTriggerKeyword}`,
      icon: MessageSquare,
      accent: 'cyan',
      glowClass: 'shadow-[0_0_15px_rgba(6,182,212,0.25)]',
      borderClass: 'border-cyan-500/30',
      badgeClass: 'bg-cyan-500/10 text-cyan-400 font-mono',
    },
    {
      step: '03',
      title: 'Native Flow Form',
      subtitle: 'Zero Web-Redirect',
      metric: '94.2% Open Rate',
      subMetric: `Target: ${activeCampaign.targetFlowId}`,
      icon: Smartphone,
      accent: 'purple',
      glowClass: 'shadow-[0_0_15px_rgba(168,85,247,0.25)]',
      borderClass: 'border-purple-500/30',
      badgeClass: 'bg-purple-500/10 text-purple-400 font-mono',
    },
    {
      step: '04',
      title: 'CRM Lead Conversion',
      subtitle: 'Automated Kanban Deal',
      metric: `${activeCampaign.leadsCaptured.toLocaleString()} leads`,
      subMetric: `$${(activeCampaign.spend / Math.max(1, activeCampaign.leadsCaptured)).toFixed(2)} CPL (3.2× ROI)`,
      icon: Users,
      accent: 'emerald',
      glowClass: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
      borderClass: 'border-emerald-500/35',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 font-bold',
    },
  ];

  return (
    <div className="bg-[#10182A] border border-[#1E2B45] rounded-2xl p-5 shadow-xl shadow-black/40">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#1E2B45] mb-5 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>CTWA 0% Drop-Off Funnel Architecture</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.2 rounded-full font-bold">
                Graph API v21.0
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Visual pipeline from Facebook/Instagram ad impression to real-time closed CRM deal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Current Funnel:</span>
          <span className="font-bold text-white bg-[#0A1020] px-2.5 py-1 rounded-lg border border-[#1E2B45]">
            {activeCampaign.name}
          </span>
        </div>
      </div>

      {/* 4 Stages Pipeline with Glowing Connectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div key={stage.step} className="relative group">
              <div
                className={`bg-[#0A1020] border ${stage.borderClass} ${stage.glowClass} rounded-2xl p-4.5 h-full flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#10182A] text-slate-400 border border-[#1E2B45]">
                      Stage {stage.step}
                    </span>
                    <div className={`p-2 rounded-xl border ${stage.borderClass} ${stage.badgeClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                    {stage.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{stage.subtitle}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1E2B45]/70 space-y-1">
                  <div className="text-base font-extrabold text-white tabular-nums tracking-tight">
                    {stage.metric}
                  </div>
                  <div className={`text-[11px] font-medium truncate ${stage.badgeClass}`}>
                    {stage.subMetric}
                  </div>
                </div>
              </div>

              {/* Glowing Arrow between stages on wide screens */}
              {idx < stages.length - 1 && (
                <div className="hidden xl:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-[#10182A] border border-[#1E2B45] items-center justify-center text-slate-400 shadow-md">
                  <ArrowRight className="w-3 h-3 text-emerald-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Funnel Bottom Stats Bar */}
      <div className="mt-4 pt-3.5 border-t border-[#1E2B45] flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>
            Drop-off eliminated by bypassing slow web landing page forms and redirects
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono font-bold text-emerald-400">
          <span>Speed: Under 12s From Ad Click to Form Submission</span>
        </div>
      </div>
    </div>
  );
};
