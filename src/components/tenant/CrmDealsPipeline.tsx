import React, { useState } from 'react';
import { CrmDeal, Contact } from '../../types.ts';
import {
  TrendingUp,
  Plus,
  DollarSign,
  User,
  Phone,
  Calendar,
  Layers,
  ArrowRight,
  Upload,
  Search,
  CheckCircle2,
} from 'lucide-react';

interface CrmDealsPipelineProps {
  deals: CrmDeal[];
  contacts: Contact[];
  onAddDeal: (deal: CrmDeal) => void;
  onUpdateDealStage: (dealId: string, newStage: CrmDeal['stage']) => void;
}

export const CrmDealsPipeline: React.FC<CrmDealsPipelineProps> = ({
  deals,
  contacts,
  onAddDeal,
  onUpdateDealStage,
}) => {
  const [activeView, setActiveView] = useState<'kanban' | 'contacts'>('kanban');
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [dealTitle, setDealTitle] = useState('');
  const [contactName, setContactName] = useState(contacts[0]?.name || 'Tariq Mansoor');
  const [dealValue, setDealValue] = useState(2500);
  const [dealStage, setDealStage] = useState<CrmDeal['stage']>('Qualified');

  const stages: CrmDeal['stage'][] = [
    'Lead In',
    'Contact Made',
    'Qualified',
    'Proposal Sent',
    'Negotiation',
    'Closed Won',
  ];

  const totalPipelineValue = deals.reduce((acc, d) => acc + d.value, 0);

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    const contact = contacts.find((c) => c.name === contactName) || contacts[0];
    const newDeal: CrmDeal = {
      id: `deal-${Date.now()}`,
      title: dealTitle || 'New Enterprise Deal',
      contactName: contact.name,
      contactPhone: contact.phone,
      stage: dealStage,
      value: dealValue,
      currency: 'USD',
      assignedAgent: 'Demo User',
      expectedCloseDate: '2026-11-15',
      createdAt: new Date().toISOString().split('T')[0],
    };
    onAddDeal(newDeal);
    setShowNewDealModal(false);
    setDealTitle('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sales CRM & Kanban Deals Pipeline
            </h1>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-mono px-2.5 py-0.5 rounded-lg border border-emerald-500/25 font-bold">
              Bi-Directional Sync
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Track lead stages, deal values, closing dates, and omnichannel contact profiles in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-[#0A1020] border border-[#1E2B45] p-1 shadow-sm">
            <button
              onClick={() => setActiveView('kanban')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'kanban' ? 'bg-emerald-500 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setActiveView('contacts')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'contacts' ? 'bg-emerald-500 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Contacts Directory
            </button>
          </div>

          <button
            onClick={() => setShowNewDealModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Deal</span>
          </button>
        </div>
      </div>

      {activeView === 'kanban' ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1100px]">
            {stages.map((st) => {
              const stageDeals = deals.filter((d) => d.stage === st);
              const stageSum = stageDeals.reduce((sum, d) => sum + d.value, 0);

              return (
                <div
                  key={st}
                  className="w-72 bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col shrink-0"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                    <div>
                      <h3 className="text-xs font-bold text-white">{st}</h3>
                      <span className="text-[10px] text-slate-400 tabular-nums">
                        ${stageSum.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                      {stageDeals.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[520px]">
                    {stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-3 rounded-lg shadow-sm space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-white line-clamp-1">{deal.title}</h4>
                          <span className="text-xs font-extrabold text-emerald-400 tabular-nums">
                            ${deal.value.toLocaleString()}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <User className="w-3 h-3 text-cyan-400" />
                          <span>{deal.contactName}</span>
                        </div>

                        <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
                          <span>Close: {deal.expectedCloseDate}</span>
                          <select
                            value={deal.stage}
                            onChange={(e) => onUpdateDealStage(deal.id, e.target.value as any)}
                            className="bg-slate-900 text-slate-300 text-[10px] rounded p-0.5 border border-slate-800 focus:outline-none"
                          >
                            {stages.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Contacts Directory Table */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Omnichannel Contact Directory</h2>
            <button
              onClick={() => alert('CSV file batch imported! 120 contacts synced.')}
              className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 border border-slate-700"
            >
              <Upload className="w-3 h-3 text-cyan-400" />
              <span>Import Contacts CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Contact Name</th>
                  <th className="p-3.5">Lifecycle</th>
                  <th className="p-3.5">Phone Number</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Assigned Agent</th>
                  <th className="p-3.5">Source</th>
                  <th className="p-3.5">Tags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {contacts.map((ct) => (
                  <tr key={ct.id} className="hover:bg-slate-800/40">
                    <td className="p-3.5 flex items-center gap-2.5">
                      <img src={ct.avatar} alt={ct.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="font-bold text-white">{ct.name}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400">
                        {ct.lifecycleStage}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono">{ct.phone}</td>
                    <td className="p-3.5 text-slate-400">{ct.email}</td>
                    <td className="p-3.5">{ct.assignedAgent}</td>
                    <td className="p-3.5 text-slate-400">{ct.source}</td>
                    <td className="p-3.5">
                      <div className="flex gap-1">
                        {ct.tags.map((t, tidx) => (
                          <span key={tidx} className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Deal Modal */}
      {showNewDealModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Create Kanban Sales Deal</h3>
            <form onSubmit={handleCreateDeal} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deal Title</label>
                <input
                  type="text"
                  value={dealTitle}
                  onChange={(e) => setDealTitle(e.target.value)}
                  placeholder="e.g. Annual Enterprise 50 Seats License"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Associated Contact</label>
                <select
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  {contacts.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Value ($)</label>
                  <input
                    type="number"
                    value={dealValue}
                    onChange={(e) => setDealValue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Initial Stage</label>
                  <select
                    value={dealStage}
                    onChange={(e) => setDealStage(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {stages.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewDealModal(false)}
                  className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
