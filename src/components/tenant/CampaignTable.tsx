import React, { useState } from 'react';
import { MetaAdCampaign } from '../../types.ts';
import { Play, Pause, MoreHorizontal, ExternalLink, Sparkles } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge.tsx';
import { PlatformBadge } from '../ui/PlatformBadge.tsx';

interface CampaignTableProps {
  campaigns: MetaAdCampaign[];
  onToggleStatus: (id: string) => void;
  onSelectCampaign?: (camp: MetaAdCampaign) => void;
}

export const CampaignTable: React.FC<CampaignTableProps> = ({
  campaigns,
  onToggleStatus,
  onSelectCampaign,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  return (
    <div className="bg-[#10182A] border border-[#1E2B45] rounded-2xl shadow-xl shadow-black/40 overflow-hidden">
      {/* Table Header Card Bar */}
      <div className="px-5 py-4 border-b border-[#1E2B45] flex items-center justify-between gap-3 bg-[#0A1020]/70">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Active Meta CTWA Ad Funnels
          </h2>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-lg bg-[#070B14] text-slate-300 border border-[#1E2B45] font-semibold font-mono">
          {campaigns.length} Campaigns
        </span>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0A1020]/90 border-b border-[#1E2B45] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Campaign Name & Platform</th>
              <th className="py-3.5 px-4 font-semibold">Status</th>
              <th className="py-3.5 px-4 font-semibold">Trigger Keyword</th>
              <th className="py-3.5 px-4 font-semibold text-right">Impressions</th>
              <th className="py-3.5 px-4 font-semibold text-right">Clicks</th>
              <th className="py-3.5 px-4 font-semibold text-right">CTWA Chats</th>
              <th className="py-3.5 px-4 font-semibold text-right">Leads</th>
              <th className="py-3.5 px-4 font-semibold text-right">Spend</th>
              <th className="py-3.5 px-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2B45]/70 text-slate-300">
            {campaigns.map((camp) => {
              const isActive = camp.status === 'active';
              return (
                <tr
                  key={camp.id}
                  className="hover:bg-[#141E34]/50 transition-colors group"
                >
                  {/* Campaign Name & Platform */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-xs sm:text-[13px] tracking-tight group-hover:text-emerald-300 transition-colors">
                      {camp.name}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <PlatformBadge platform={camp.platform} />
                      <span className="text-[11px] text-slate-400">
                        Target Flow:{' '}
                        <span className="text-emerald-400/90 font-mono font-semibold">
                          {camp.targetFlowId}
                        </span>
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={camp.status} />
                  </td>

                  {/* Trigger Keyword */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center font-mono font-bold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded-md text-[11px]">
                      {camp.ctwaTriggerKeyword}
                    </span>
                  </td>

                  {/* Impressions */}
                  <td className="py-3.5 px-4 text-right tabular-nums text-slate-300">
                    {camp.impressions.toLocaleString()}
                  </td>

                  {/* Clicks */}
                  <td className="py-3.5 px-4 text-right tabular-nums text-slate-300">
                    {camp.clicks.toLocaleString()}
                  </td>

                  {/* CTWA Chats */}
                  <td className="py-3.5 px-4 text-right tabular-nums font-extrabold text-white">
                    {camp.conversationsStarted.toLocaleString()}
                  </td>

                  {/* Leads */}
                  <td className="py-3.5 px-4 text-right tabular-nums font-extrabold text-emerald-400">
                    {camp.leadsCaptured.toLocaleString()}
                  </td>

                  {/* Spend */}
                  <td className="py-3.5 px-4 text-right tabular-nums font-semibold text-slate-200">
                    ${camp.spend.toLocaleString()}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5 justify-center">
                      <button
                        onClick={() => onToggleStatus(camp.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isActive
                            ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}
                        title={isActive ? 'Pause Campaign' : 'Resume Campaign'}
                      >
                        {isActive ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveMenuId(activeMenuId === camp.id ? null : camp.id)
                          }
                          className="p-1.5 rounded-lg bg-[#0A1020] hover:bg-[#141E34] text-slate-400 hover:text-white border border-[#1E2B45] transition-colors"
                          title="More Actions"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>

                        {activeMenuId === camp.id && (
                          <div className="absolute right-0 mt-1 w-44 bg-[#10182A] border border-[#1E2B45] rounded-xl shadow-2xl p-1 z-50 text-left">
                            <button
                              onClick={() => {
                                onSelectCampaign?.(camp);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-[#141E34] transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                              <span>View Ad Creative</span>
                            </button>
                            <button
                              onClick={() => {
                                onToggleStatus(camp.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-[#141E34] transition-colors"
                            >
                              {isActive ? (
                                <>
                                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Pause Campaign</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Resume Campaign</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
