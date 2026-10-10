import React, { useState } from 'react';
import {
  Cpu,
  Zap,
  DollarSign,
  Clock,
  Layers,
  BarChart3,
  Filter,
  CheckCircle2,
} from 'lucide-react';

export const AiTelemetry: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<string>('all');

  const telemetryByFeature = [
    { feature: 'Autonomous Copilot', model: 'gemini-3.8-flash', promptTokens: 342000, compTokens: 184000, totalTokens: 526000, latency: '240ms', cost: '$0.052' },
    { feature: 'Prompt-to-Flow Generator', model: 'gpt-4o', promptTokens: 412000, compTokens: 210000, totalTokens: 622000, latency: '420ms', cost: '$1.450' },
    { feature: 'AI ChatBots (RAG)', model: 'claude-3.5-sonnet', promptTokens: 610000, compTokens: 320000, totalTokens: 930000, latency: '360ms', cost: '$2.120' },
    { feature: 'Social Copywriter', model: 'gemini-3.8-flash', promptTokens: 182000, compTokens: 140000, totalTokens: 322000, latency: '210ms', cost: '$0.038' },
    { feature: 'Smart Inbox Replies', model: 'groq-llama-3.3-70b', promptTokens: 240000, compTokens: 85000, totalTokens: 325000, latency: '110ms', cost: '$0.180' },
    { feature: 'Vector RAG Embeddings', model: 'text-embedding-004', promptTokens: 520000, compTokens: 0, totalTokens: 520000, latency: '85ms', cost: '$0.026' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Token Usage & Cost Telemetry
            </h1>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-mono px-2.5 py-0.5 rounded-lg border border-emerald-500/25 font-bold">
              Live Inference Tracker
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Monitor prompt/completion tokens, inference costs in USD, and millisecond latency across all supported AI models.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#10182A] border border-[#1E2B45] hover:border-[#2B3D60] p-5 rounded-2xl shadow-lg transition-all">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total AI Tokens Consumed</span>
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums tracking-tight">3,245,000</div>
          <div className="text-[11px] text-slate-400 mt-1">Prompt: 2.3M · Completion: 945K</div>
        </div>

        <div className="bg-[#10182A] border border-[#1E2B45] hover:border-[#2B3D60] p-5 rounded-2xl shadow-lg transition-all">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
            <span>Estimated Inference Cost</span>
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums tracking-tight">$3.86 USD</div>
          <div className="text-[11px] text-emerald-400 mt-1">94% Saved via Hybrid/BYOK</div>
        </div>

        <div className="bg-[#10182A] border border-[#1E2B45] hover:border-[#2B3D60] p-5 rounded-2xl shadow-lg transition-all">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Average API Latency</span>
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums tracking-tight">238 ms</div>
          <div className="text-[11px] text-slate-400 mt-1">Ultra-fast Groq & Gemini Flash</div>
        </div>

        <div className="bg-[#10182A] border border-[#1E2B45] hover:border-[#2B3D60] p-5 rounded-2xl shadow-lg transition-all">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Remaining Monthly Allowance</span>
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums tracking-tight">1,755,000</div>
          <div className="text-[11px] text-emerald-400 mt-1">Plan Limit: 5,000,000</div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-[#10182A] border border-[#1E2B45] rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
        <div className="p-4 border-b border-[#1E2B45] flex items-center justify-between bg-[#0A1020]">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Breakdown by Platform Feature & LLM Engine
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Live Telemetry Synchronized</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070B14] text-slate-400 font-semibold border-b border-[#1E2B45]">
              <tr>
                <th className="p-3.5">Platform Feature</th>
                <th className="p-3.5">Assigned LLM Model</th>
                <th className="p-3.5">Prompt Tokens</th>
                <th className="p-3.5">Completion Tokens</th>
                <th className="p-3.5">Total Tokens</th>
                <th className="p-3.5">Latency</th>
                <th className="p-3.5 text-right">Inference Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2B45]/70 text-slate-300">
              {telemetryByFeature.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#141E34] transition-colors">
                  <td className="p-3.5 font-bold text-white">{item.feature}</td>
                  <td className="p-3.5">
                    <span className="font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded text-[11px]">
                      {item.model}
                    </span>
                  </td>
                  <td className="p-3.5 tabular-nums font-mono">{item.promptTokens.toLocaleString()}</td>
                  <td className="p-3.5 tabular-nums font-mono">{item.compTokens.toLocaleString()}</td>
                  <td className="p-3.5 tabular-nums font-bold text-white font-mono">{item.totalTokens.toLocaleString()}</td>
                  <td className="p-3.5 tabular-nums text-slate-400 font-mono">{item.latency}</td>
                  <td className="p-3.5 text-right font-bold text-emerald-400 tabular-nums font-mono">{item.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
