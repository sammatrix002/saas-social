import React, { useState } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
} from 'lucide-react';

export const LiveChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<
    { sender: 'visitor' | 'bot'; text: string; time: string }[]
  >([
    {
      sender: 'bot',
      text: '👋 Hi there! Welcome to WhatsOmni. How can our automated AI concierge assist you today?',
      time: 'Just now',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { sender: 'visitor', text: userText, time: nowTime }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: data.reply || 'Thank you for reaching out!', time: nowTime },
      ]);
    } catch {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `Thanks for your inquiry about "${userText}". Our team is available 24/7. You can also chat directly on WhatsApp or book a consultation on our calendar!`,
            time: nowTime,
          },
        ]);
      }, 700);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Pill Button with subtle glow */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.55)] transition-all hover:scale-105 active:scale-95 group"
          title="Open Live Chat Widget"
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4 fill-current" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-300 animate-ping" />
          </div>
          <span className="tracking-tight">Live Chat Widget</span>
        </button>
      ) : (
        /* Floating Chat Window */
        <div className="w-80 sm:w-96 bg-[#10182A] border border-[#1E2B45] rounded-2xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col h-[490px] animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-3.5 bg-[#0A1020] border-b border-[#1E2B45] flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-xs text-white shadow-sm">
                W
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span>WhatsOmni Live Support</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-slate-400">WebSocket Connected · Port 8080</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#141E34]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#070B14]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'visitor' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                    m.sender === 'visitor'
                      ? 'bg-emerald-500 text-white rounded-tr-none shadow-sm'
                      : 'bg-[#10182A] text-slate-200 border border-[#1E2B45] rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-[#10182A] p-2 rounded-xl w-fit border border-[#1E2B45]">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>Concierge is typing...</span>
              </div>
            )}
          </div>

          {/* Input form */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-[#1E2B45] bg-[#0A1020] flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 bg-[#070B14] border border-[#1E2B45] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-white transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
