import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Zap,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFlow?: (prompt: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  latencyMs?: number;
  tokensUsed?: number;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  isOpen,
  onClose,
  onApplyFlow,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'copilot',
      text: `Hello! I am your autonomous **WhatsOmni v3.0 Platform Copilot**. 
I can help you:
• Architect high-converting Meta Click-to-WhatsApp (CTWA) funnels
• Generate visual drag-and-drop conversational flows
• Formulate native WhatsApp Flow Forms for KYC, CSAT, or Bookings
• Analyze CRM deal velocity and draft social media copy.

How can I assist your marketing & automation pipeline today?`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'How do I reduce drop-off on my Meta CTWA campaigns?',
    'Generate a 4-step WhatsApp Flow for booking a consultation',
    'Best practices for WhatsApp Anti-Ban rate delays',
    'Draft a 30-min Shopify abandoned cart recovery template',
  ];

  const handleSend = async (userPrompt: string) => {
    if (!userPrompt.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userPrompt,
          context: {
            workspace: 'Acme Global Commerce',
            activeChannels: 10,
            activeCampaigns: 3,
          },
        }),
      });

      if (!res.ok) throw new Error('Copilot response error');
      const data = await res.json();

      const copilotMsg: Message = {
        id: `c-${Date.now()}`,
        sender: 'copilot',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        latencyMs: data.latencyMs,
        tokensUsed: data.tokensUsed?.total || 320,
      };

      setMessages((prev) => [...prev, copilotMsg]);
    } catch (err) {
      // Offline fallback
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `c-${Date.now()}`,
            sender: 'copilot',
            text: `Based on WhatsOmni best practices:\n\n` +
              `1. Connect your Meta Ad campaign directly to WhatsApp Cloud API with trigger keyword \`#DISCOUNT\`.\n` +
              `2. Direct user into a Native WhatsApp Flow Form with zero drop-off.\n` +
              `3. Create a CRM deal in your "Qualified" stage.\n` +
              `4. Respect rate limits (0.2s for Cloud API, 4-8s randomized jitter for Baileys).`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            latencyMs: 140,
            tokensUsed: 280,
          },
        ]);
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm transition-opacity flex justify-end">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">Autonomous Platform Copilot</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                  Gemini 3.8 Flash
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Context-aware SaaS workflow & funnel assistant
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts bar */}
        <div className="px-4 py-2 bg-slate-950/50 border-b border-slate-800/80 overflow-x-auto flex gap-2 no-scrollbar">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700/80 text-slate-300 whitespace-nowrap transition-colors border border-slate-700/50 shrink-0"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Messages Container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none'
                }`}
              >
                {m.text}
              </div>

              {m.sender === 'copilot' && (
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500 font-mono">
                  <span>{m.timestamp}</span>
                  {m.latencyMs && <span>· {m.latencyMs}ms</span>}
                  {m.tokensUsed && <span>· {m.tokensUsed} tokens</span>}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 py-2">
              <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Analyzing workspace telemetry & generating solution...</span>
            </div>
          )}
        </div>

        {/* Footer Input */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot to build a flow, optimize ads, or draft WhatsApp forms..."
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-emerald-500/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition-all shadow-md shadow-emerald-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
