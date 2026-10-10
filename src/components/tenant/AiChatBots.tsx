import React, { useState } from 'react';
import { AiChatBot, KnowledgeDoc } from '../../types.ts';
import {
  Bot,
  Plus,
  Database,
  FileText,
  Search,
  Send,
  Sparkles,
  CheckCircle2,
  Sliders,
  Clock,
  Layers,
  Upload,
  ExternalLink,
} from 'lucide-react';

interface AiChatBotsProps {
  chatbots: AiChatBot[];
  knowledgeDocs: KnowledgeDoc[];
}

export const AiChatBots: React.FC<AiChatBotsProps> = ({
  chatbots,
  knowledgeDocs,
}) => {
  const [selectedBot, setSelectedBot] = useState<AiChatBot>(chatbots[0]);
  const [testQuery, setTestQuery] = useState('');
  const [testHistory, setTestHistory] = useState<
    { role: 'user' | 'bot'; text: string; source?: string; latency?: number }[]
  >([
    {
      role: 'bot',
      text: 'Hello! I am grounded on your uploaded PDFs and knowledge chunks. Ask me any product, technical or SLA question.',
    },
  ]);
  const [simulating, setSimulating] = useState(false);

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuery.trim()) return;

    const userQ = testQuery;
    setTestHistory((prev) => [...prev, { role: 'user', text: userQ }]);
    setTestQuery('');
    setSimulating(true);

    setTimeout(() => {
      let botAnswer = `Based on your ingested documents [WhatsOmni_v3_Documentation_Hub.pdf]:\n` +
        `WhatsOmni v3.0 features a 2-Tier Anti-Ban Engine with randomized 4–8s rate delays for Baileys QR, 0.2s smooth dispatch for Meta Cloud API, and 99.95% WebSocket uptime.`;

      if (userQ.toLowerCase().includes('price') || userQ.toLowerCase().includes('cost')) {
        botAnswer = `From [Pricing_and_SLA_Terms.docx]:\n` +
          `Starter plans begin at $39/month. Platform owners can choose between Master Managed API keys or Bring-Your-Own-Key (BYOK) for 0% markup.`;
      }

      setTestHistory((prev) => [
        ...prev,
        {
          role: 'bot',
          text: botAnswer,
          source: 'WhatsOmni_v3_Documentation_Hub.pdf (Chunk #18, Cosine Similarity: 0.94)',
          latency: 280,
        },
      ]);
      setSimulating(false);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Standalone AI ChatBots & Vector RAG Engine
            </h1>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-mono px-2.5 py-0.5 rounded-lg border border-emerald-500/25 font-bold">
              Cosine Similarity Search
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Deploy hallucination-free conversational agents grounded strictly in ingested PDF, DOCX, TXT, and URL knowledge stores.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Bot Config & Knowledge Docs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Bot Profile Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedBot.name}</h3>
                  <div className="text-[10px] text-slate-400 font-mono">Model: {selectedBot.model}</div>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">
                Active & Bound to 3 Channels
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">System Persona & Prompt</label>
                <textarea
                  value={selectedBot.systemPrompt}
                  rows={3}
                  readOnly
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 font-mono text-[11px] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Temperature ({selectedBot.temperature})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={selectedBot.temperature}
                    readOnly
                    className="w-full accent-emerald-500"
                  />
                  <span className="text-[10px] text-slate-500">Low temperature = factual accuracy</span>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Human Handoff Escalation</label>
                  <div className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
                    Triggers: "human", "agent", "refund"
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ingested Vector RAG Knowledge Stores */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Ingested Vector Knowledge Chunks
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">196 Total Chunks Vectorized</span>
            </div>

            <div className="divide-y divide-slate-800/60">
              {knowledgeDocs.map((doc) => (
                <div key={doc.id} className="p-4 hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-white">{doc.name}</span>
                    </div>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                      {doc.chunkCount} Chunks
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                    {doc.previewContent}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Uploaded: {doc.uploadedAt} · Size: {doc.size}</span>
                    <span className="text-emerald-400">Semantic Cosine Index Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Playground & Sandbox Tester */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col h-[560px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                RAG Testing Sandbox
              </h3>
            </div>
            <span className="text-[10px] text-emerald-400">Grounding Verifier</span>
          </div>

          {/* Test Messages */}
          <div className="flex-1 overflow-y-auto p-2 space-y-3">
            {testHistory.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-950 text-slate-200 border border-slate-800'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>
                  {m.source && (
                    <div className="mt-2 pt-1 border-t border-slate-800 text-[10px] text-cyan-400 font-mono">
                      🔍 Retrieved Source: {m.source}
                    </div>
                  )}
                </div>
                {m.latency && (
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5">
                    Latency: {m.latency}ms
                  </span>
                )}
              </div>
            ))}
            {simulating && (
              <div className="text-xs text-emerald-400 flex items-center gap-2 py-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Running vector cosine search over ingested knowledge...</span>
              </div>
            )}
          </div>

          {/* Test Input */}
          <form onSubmit={handleTestSubmit} className="pt-3 border-t border-slate-800 shrink-0 flex gap-2">
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="Test a question against your PDF knowledge..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={simulating || !testQuery.trim()}
              className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
