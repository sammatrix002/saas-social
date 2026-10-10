import React, { useState } from 'react';
import { BroadcastCampaign } from '../../types.ts';
import {
  Send,
  Plus,
  Play,
  Pause,
  XCircle,
  CheckCircle2,
  Clock,
  Shield,
  Layers,
  BarChart3,
  Sliders,
  AlertTriangle,
  FileText,
  Eye,
  Phone,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

interface MetaTemplate {
  id: string;
  name: string;
  language: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  headerType: 'NONE' | 'TEXT' | 'IMAGE';
  headerText?: string;
  body: string;
  footer?: string;
  buttons: { type: 'QUICK_REPLY' | 'URL' | 'PHONE'; text: string; urlOrPhone?: string }[];
}

interface BroadcastCampaignsProps {
  campaigns: BroadcastCampaign[];
  onToggleStatus: (id: string, newStatus: 'running' | 'paused' | 'cancelled') => void;
}

export const BroadcastCampaigns: React.FC<BroadcastCampaignsProps> = ({
  campaigns,
  onToggleStatus,
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'campaigns' | 'templates'>('campaigns');
  const [selectedCampaign, setSelectedCampaign] = useState<BroadcastCampaign>(campaigns[0]);

  // Meta Templates
  const [templates, setTemplates] = useState<MetaTemplate[]>([
    {
      id: 'tpl-101',
      name: 'autumn_vip_collection_v2',
      language: 'en_US',
      category: 'MARKETING',
      status: 'APPROVED',
      headerType: 'TEXT',
      headerText: 'Exclusive Seasonal Access 🍂',
      body: 'Hello {{1}}! As a valued VIP member, your exclusive access to our Autumn Collection is now live. Use voucher code {{2}} at checkout.',
      footer: 'Reply STOP to opt out',
      buttons: [
        { type: 'QUICK_REPLY', text: 'Claim Voucher 🎁' },
        { type: 'URL', text: 'Visit Storefront 🛍', urlOrPhone: 'https://whatsomni.com/autumn' },
      ],
    },
    {
      id: 'tpl-102',
      name: 'webinar_live_invitation',
      language: 'en_US',
      category: 'MARKETING',
      status: 'APPROVED',
      headerType: 'TEXT',
      headerText: 'Live Masterclass Reminder 🚀',
      body: 'Greetings {{1}}! The live CTWA Funnel & Automation Masterclass kicks off in 15 minutes. Join our technical leads now.',
      footer: 'WhatsOmni Enterprise',
      buttons: [
        { type: 'URL', text: 'Join Live Session 🎥', urlOrPhone: 'https://meet.google.com/omni-v3-call' },
      ],
    },
    {
      id: 'tpl-103',
      name: 'otp_auth_code_v1',
      language: 'en_US',
      category: 'AUTHENTICATION',
      status: 'APPROVED',
      headerType: 'NONE',
      body: 'Your WhatsOmni security verification code is: {{1}}. Valid for 10 minutes. Do not share this code.',
      buttons: [
        { type: 'QUICK_REPLY', text: 'Copy Code 📋' },
      ],
    },
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<MetaTemplate>(templates[0]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Anti-Ban Broadcast Campaigns & Meta Templates
            </h1>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-mono px-2.5 py-0.5 rounded-lg border border-emerald-500/25 font-bold">
              Two-Tier Anti-Ban Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Non-blocking queue delays with randomized jitter (4–8s for Baileys, 0.2s for Cloud API) and official WhatsApp Meta Template manager.
          </p>
        </div>

        <div className="flex rounded-xl bg-[#0A1020] border border-[#1E2B45] p-1 shadow-sm">
          <button
            onClick={() => setActiveMainTab('campaigns')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMainTab === 'campaigns' ? 'bg-emerald-500 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Broadcast Campaigns
          </button>
          <button
            onClick={() => setActiveMainTab('templates')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMainTab === 'templates' ? 'bg-emerald-500 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Meta Templates Manager
          </button>
        </div>
      </div>

      {activeMainTab === 'campaigns' ? (
        /* Campaigns Table & Live Telemetry Progress */
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Broadcast Campaigns Queue
              </h2>
              <span className="text-[11px] text-slate-400">{campaigns.length} Total Campaigns</span>
            </div>

            <div className="divide-y divide-slate-800/60">
              {campaigns.map((camp) => {
                const isSelected = camp.id === selectedCampaign.id;
                const percent = Math.round((camp.sent / camp.totalRecipients) * 100);

                return (
                  <div
                    key={camp.id}
                    onClick={() => setSelectedCampaign(camp)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected ? 'bg-slate-800/60 border-l-2 border-emerald-500' : 'hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{camp.name}</span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                          {camp.channel}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                            camp.status === 'running'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : camp.status === 'paused'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {camp.status}
                        </span>

                        {camp.status === 'running' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleStatus(camp.id, 'paused');
                            }}
                            className="p-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300"
                            title="Pause Broadcast"
                          >
                            <Pause className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {camp.status === 'paused' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleStatus(camp.id, 'running');
                            }}
                            className="p-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400"
                            title="Resume Broadcast"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {camp.status !== 'completed' && camp.status !== 'cancelled' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleStatus(camp.id, 'cancelled');
                            }}
                            className="p-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300"
                            title="Cancel Broadcast"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 mb-2">
                      Audience: {camp.targetAudience} · Delay: {camp.delayPerMessageSec}s (±{camp.jitterWindowSec}s jitter)
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>Progress ({percent}%)</span>
                        <span>{camp.sent} / {camp.totalRecipients} Contacts</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Anti-Ban Rate Engine
                </h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Zero Suspensions</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="font-bold text-white">Non-Blocking Queue Jitter</div>
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Channel Base Delay</span>
                  <span className="text-white font-mono">{selectedCampaign.delayPerMessageSec}s</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Random Jitter Window</span>
                  <span className="text-emerald-400 font-mono">±{selectedCampaign.jitterWindowSec}s</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
                <div className="font-bold text-white">Live Dispatches Telemetry</div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    <span className="text-[10px] text-slate-500 block">Delivered</span>
                    <span className="font-bold text-emerald-400 tabular-nums">{selectedCampaign.delivered}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    <span className="text-[10px] text-slate-500 block">Read Rate</span>
                    <span className="font-bold text-cyan-400 tabular-nums">
                      {Math.round((selectedCampaign.read / Math.max(1, selectedCampaign.delivered)) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-300">
                🛡 Crash Resumption Guarantee active. Auto-resumes pending recipients on server restarts.
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Meta WhatsApp Templates Manager */
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Meta Graph API Approved Templates
                </h3>
                <p className="text-[11px] text-slate-400">Synced directly with WhatsApp Business Account (WABA)</p>
              </div>
              <button
                onClick={() => alert('New template submitted to Meta Graph API for review!')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Template</span>
              </button>
            </div>

            <div className="divide-y divide-slate-800/60">
              {templates.map((tpl) => {
                const isSelected = tpl.id === selectedTemplate.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl)}
                    className={`p-4 cursor-pointer transition-colors flex items-center justify-between ${
                      isSelected ? 'bg-slate-800/70 border-l-2 border-emerald-500' : 'hover:bg-slate-850'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{tpl.name}</span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                          {tpl.language}
                        </span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded">
                          {tpl.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                        {tpl.body}
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-emerald-400 shrink-0">
                      Preview ➔
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Template WhatsApp Chat Bubble Mockup */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                WhatsApp Chat Bubble Preview
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                Category: {selectedTemplate.category}
              </span>
            </div>

            {/* Simulated WhatsApp Message Bubble */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-700/40 text-slate-200 text-xs space-y-2.5 shadow-xl max-w-sm mx-auto">
              {selectedTemplate.headerText && (
                <div className="font-bold text-white text-sm pb-1 border-b border-emerald-800/30">
                  {selectedTemplate.headerText}
                </div>
              )}

              <div className="leading-relaxed whitespace-pre-line text-slate-200">
                {selectedTemplate.body
                  .replace('{{1}}', 'Tariq Mansoor')
                  .replace('{{2}}', 'AUTUMN25-VIP')}
              </div>

              {selectedTemplate.footer && (
                <div className="text-[10px] text-slate-400 pt-1">
                  {selectedTemplate.footer}
                </div>
              )}

              {/* Template Buttons */}
              {selectedTemplate.buttons.length > 0 && (
                <div className="pt-2 border-t border-emerald-800/40 space-y-1.5">
                  {selectedTemplate.buttons.map((btn, bIdx) => (
                    <div
                      key={bIdx}
                      className="py-1.5 px-3 rounded-lg bg-emerald-900/60 border border-emerald-700/50 text-center font-semibold text-emerald-300 text-xs flex items-center justify-center gap-1.5"
                    >
                      {btn.type === 'URL' ? <ExternalLink className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                      <span>{btn.text}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-[9px] text-emerald-400/80 text-right font-mono">
                10:30 AM · Delivered ✓✓
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
              Approved Meta templates can be broadcasted immediately to any contact segment without the 24-hour customer care session window restriction.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
