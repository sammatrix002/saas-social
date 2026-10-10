import React, { useState } from 'react';
import {
  ChannelInfo,
  Contact,
  Conversation,
  ChatMessage,
  ChannelType,
} from '../../types.ts';
import {
  Search,
  Filter,
  Send,
  Sparkles,
  Paperclip,
  CheckCheck,
  Phone,
  Mail,
  User,
  Tag,
  Shield,
  Layers,
  ShoppingBag,
  TrendingUp,
  FileText,
  Clock,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Bot,
  Zap,
} from 'lucide-react';

interface SharedInboxProps {
  channels: ChannelInfo[];
  conversations: Conversation[];
  contacts: Contact[];
  flowForms?: any[];
  catalogItems?: any[];
  onSendMessage: (conversationId: string, text: string, isInternalNote?: boolean) => void;
  onDispatchFlowForm?: (conversationId: string, formTitle: string) => void;
  onDispatchCatalog?: (conversationId: string, itemName: string) => void;
}

export const SharedInbox: React.FC<SharedInboxProps> = ({
  channels,
  conversations,
  contacts,
  onSendMessage,
  onDispatchFlowForm,
  onDispatchCatalog,
}) => {
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'open' | 'pending' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || 'conv-1');
  const [messageInput, setMessageInput] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [showSnippetMenu, setShowSnippetMenu] = useState(false);
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [loadingSmartReplies, setLoadingSmartReplies] = useState(false);

  const cannedSnippets = [
    { shortcut: '/welcome', title: 'Welcome Greeting', text: 'Hello {{contact.name}}! Thank you for reaching out to WhatsOmni. How can we help you today?' },
    { shortcut: '/pricing', title: 'Pricing & Plans', text: 'Our plans start at $39/mo with full 10-channel access. You can review all tiers here: https://whatsomni.com/pricing' },
    { shortcut: '/flow', title: 'WhatsApp Flow Form', text: 'Please fill out our native WhatsApp Booking Form to confirm your consultation slot with zero redirect drop-off.' },
    { shortcut: '/coupon', title: 'Special Discount', text: 'As a valued customer, here is an exclusive 15% discount code: SAVE15-VIP' },
  ];

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];
  const activeContact = contacts.find((c) => c.id === activeConv?.contactId) || contacts[0];
  const activeChannel = channels.find((ch) => ch.type === activeConv?.channel) || channels[0];

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (selectedChannelFilter !== 'all' && c.channel !== selectedChannelFilter) return false;
    if (selectedStatusFilter !== 'all' && c.status !== selectedStatusFilter) return false;
    if (searchQuery) {
      const contact = contacts.find((ct) => ct.id === c.contactId);
      const query = searchQuery.toLowerCase();
      const nameMatch = contact?.name.toLowerCase().includes(query);
      const msgMatch = c.lastMessage.toLowerCase().includes(query);
      if (!nameMatch && !msgMatch) return false;
    }
    return true;
  });

  const handleInputChange = (val: string) => {
    setMessageInput(val);
    if (val.startsWith('/')) {
      setShowSnippetMenu(true);
    } else {
      setShowSnippetMenu(false);
    }
  };

  const handleInsertSnippet = (snippetText: string) => {
    const formatted = snippetText.replace('{{contact.name}}', activeContact?.name || 'Customer');
    setMessageInput(formatted);
    setShowSnippetMenu(false);
  };

  const handleGenerateSmartReplies = async () => {
    setLoadingSmartReplies(true);
    const lastCustomerMsg = [...(activeConv?.messages || [])]
      .reverse()
      .find((m) => m.sender === 'customer')?.text || 'Can you help me with pricing?';

    try {
      const res = await fetch('/api/ai/smart-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: lastCustomerMsg,
          customerName: activeContact?.name,
        }),
      });
      const data = await res.json();
      setSmartReplies(data.replies || []);
    } catch {
      setSmartReplies([
        `Hello ${activeContact.name}! We'd be glad to schedule an executive demonstration for your team.`,
        `Here is our WhatsApp interactive catalog. Feel free to browse and add items to your cart!`,
        `I have updated your reservation. You will receive an automated confirmation link shortly.`,
      ]);
    } finally {
      setLoadingSmartReplies(false);
    }
  };

  const handleSend = () => {
    if (!messageInput.trim()) return;
    onSendMessage(activeConv.id, messageInput, isInternalNote);
    setMessageInput('');
    setIsInternalNote(false);
    setShowSnippetMenu(false);
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] bg-[#10182A] border border-[#1E2B45] rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
      {/* Column 1: Channel & Conversation List */}
      <div className="w-80 sm:w-96 border-r border-[#1E2B45] flex flex-col bg-[#0A1020]">
        {/* Header & Filter Controls */}
        <div className="p-3.5 border-b border-[#1E2B45] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Shared Inbox</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md font-mono border border-emerald-500/20 font-bold">
                {filteredConversations.length} Active
              </span>
            </h2>
            <div className="flex items-center gap-1">
              {(['all', 'open', 'pending', 'resolved'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatusFilter(st)}
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-lg capitalize transition-colors ${
                    selectedStatusFilter === st
                      ? 'bg-emerald-500 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#141E34]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts, messages, phones..."
              className="w-full bg-[#070B14] border border-[#1E2B45] focus:border-emerald-500/60 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Channel Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedChannelFilter('all')}
              className={`text-[11px] px-2.5 py-1 rounded-lg shrink-0 transition-colors font-medium ${
                selectedChannelFilter === 'all'
                  ? 'bg-[#10182A] text-white font-bold border border-[#1E2B45]'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-[#10182A]/50'
              }`}
            >
              All Channels
            </button>
            {channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setSelectedChannelFilter(ch.type)}
                className={`text-[11px] px-2 py-1 rounded-lg shrink-0 flex items-center gap-1 transition-colors font-medium ${
                  selectedChannelFilter === ch.type
                    ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                    : 'text-slate-400 hover:bg-[#10182A] hover:text-slate-200'
                }`}
                title={ch.name}
              >
                <span>{ch.name.split(' ')[0]}</span>
                {ch.unreadCount > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#1E2B45]/60">
          {filteredConversations.map((conv) => {
            const contact = contacts.find((ct) => ct.id === conv.contactId);
            const ch = channels.find((c) => c.type === conv.channel);
            const isSelected = conv.id === activeConv?.id;

            return (
              <button
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                  isSelected
                    ? 'bg-[#10182A] border-l-2 border-emerald-500'
                    : 'hover:bg-[#10182A]/50'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={contact?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                    alt={contact?.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#1E2B45]"
                  />
                  <span className="absolute -bottom-1 -right-1 text-[9px] bg-[#0A1020] border border-[#1E2B45] rounded-full px-1 text-emerald-400 font-mono font-bold">
                    {ch?.type.includes('whatsapp') ? 'WA' : ch?.type === 'instagram' ? 'IG' : 'TG'}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white truncate">{contact?.name}</span>
                    <span className="text-[10px] text-slate-500">{conv.lastMessageTime}</span>
                  </div>

                  <div className="text-xs text-slate-400 truncate mb-1.5">
                    {conv.lastMessage}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                      {ch?.name.split(' ')[0]}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded capitalize ${
                      contact?.lifecycleStage === 'VIP' ? 'bg-amber-500/15 text-amber-300 font-bold' :
                      contact?.lifecycleStage === 'Customer' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {contact?.lifecycleStage}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Column 2: Active Chat Canvas */}
      <div className="flex-1 flex flex-col bg-slate-950">
        {/* Active Chat Header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <img
              src={activeContact?.avatar}
              alt={activeContact?.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-700"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{activeContact?.name}</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  {activeChannel?.name}
                </span>
                <span className="text-[10px] text-slate-400">({activeContact?.phone})</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>Assigned: {activeConv?.assignedAgent}</span>
                <span>·</span>
                <span className="text-emerald-400">Reverb WebSocket Connected</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onDispatchFlowForm?.(activeConv.id, 'Appointment Booking')}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Send WhatsApp Flow</span>
            </button>
            <button
              onClick={() => onDispatchCatalog?.(activeConv.id, 'WhatsOmni Cloud Enterprise License')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
              <span>Send Catalog Item</span>
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-950">
          {activeConv?.messages.map((msg) => {
            const isMe = msg.sender === 'agent';
            const isBot = msg.sender === 'bot';

            if (msg.isInternalNote) {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <div className="bg-amber-950/40 border border-amber-600/40 rounded-xl px-4 py-2 text-xs text-amber-200 max-w-lg shadow-md">
                    <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-0.5 text-[11px]">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Internal Team Note (Invisible to Customer)</span>
                    </div>
                    <div>{msg.text}</div>
                    <div className="text-[10px] text-amber-400/80 text-right mt-1">{msg.timestamp}</div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="text-[10px] text-slate-500 mb-1 px-1">
                  {msg.senderName} · {msg.timestamp}
                </div>
                <div
                  className={`max-w-md sm:max-w-lg rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    isMe
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : isBot
                      ? 'bg-slate-800/90 text-cyan-200 border border-cyan-800/40 rounded-tl-none'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>

                  {msg.metadata?.flowFormSubmitted && (
                    <div className="mt-2.5 p-2 rounded-lg bg-emerald-950/80 border border-emerald-600/50 text-[11px] text-emerald-200">
                      <div className="font-bold flex items-center gap-1 text-emerald-400 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Native WhatsApp Flow Submission Received</span>
                      </div>
                      <div>Service: {msg.metadata.flowFormData?.service || 'Strategy Consultation'}</div>
                      <div>Time Slot: {msg.metadata.flowFormData?.slot || '10:00 AM'}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Gemini AI Smart Reply Suggestions Drawer / Bar */}
        <div className="px-4 py-2 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={handleGenerateSmartReplies}
              disabled={loadingSmartReplies}
              className="text-[11px] px-2.5 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30 flex items-center gap-1 shrink-0 transition-colors"
            >
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>{loadingSmartReplies ? 'Generating...' : 'Suggest AI Replies'}</span>
            </button>

            {smartReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => setMessageInput(reply)}
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 truncate max-w-xs transition-colors shrink-0 border border-slate-700/60"
                title={reply}
              >
                {reply}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsInternalNote(!isInternalNote)}
            className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-colors shrink-0 flex items-center gap-1 ${
              isInternalNote
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Yellow Note</span>
          </button>
        </div>

        {/* Message Input Box */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-900 relative">
          {/* Canned Snippet Dropdown */}
          {showSnippetMenu && (
            <div className="absolute bottom-full left-4 mb-2 w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Quick Response Snippets (Merge Tags Supported)
              </div>
              <div className="space-y-1">
                {cannedSnippets.map((sn, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => handleInsertSnippet(sn.text)}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-xs transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 font-mono">{sn.shortcut}</span>
                      <span className="text-[10px] text-slate-500">{sn.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 truncate">{sn.text}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <textarea
              value={messageInput}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={
                isInternalNote
                  ? 'Add private yellow note visible only to team agents...'
                  : 'Type a message... (Type / for quick canned snippets)'
              }
              rows={2}
              className={`flex-1 rounded-xl p-2.5 text-xs focus:outline-none resize-none transition-colors ${
                isInternalNote
                  ? 'bg-amber-950/30 border border-amber-600/50 text-amber-200 placeholder-amber-500/60'
                  : 'bg-slate-950 border border-slate-800 focus:border-emerald-500/60 text-white placeholder-slate-500'
              }`}
            />
            <button
              onClick={handleSend}
              disabled={!messageInput.trim()}
              className={`p-3 rounded-xl transition-all shadow-md ${
                isInternalNote
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold disabled:opacity-40'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Column 3: Contact & E-Commerce Side Drawer */}
      <div className="w-72 lg:w-80 border-l border-slate-800 bg-slate-900/40 p-4 overflow-y-auto hidden md:block space-y-6">
        {/* Contact Profile */}
        <div>
          <div className="text-center mb-4">
            <img
              src={activeContact?.avatar}
              alt={activeContact?.name}
              className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-emerald-500 mb-2 shadow-lg"
            />
            <h3 className="text-sm font-bold text-white">{activeContact?.name}</h3>
            <p className="text-xs text-slate-400">{activeContact?.customFields?.Company || 'Enterprise Client'}</p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Lifecycle</span>
              <span className="font-bold text-emerald-400">{activeContact?.lifecycleStage}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Phone</span>
              <span className="text-slate-200 font-mono text-[11px]">{activeContact?.phone}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Email</span>
              <span className="text-slate-200 text-[11px] truncate max-w-[140px]">{activeContact?.email}</span>
            </div>
          </div>
        </div>

        {/* Custom Fields */}
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            CRM Custom Fields
          </h4>
          <div className="space-y-1.5 text-xs">
            {Object.entries(activeContact?.customFields || {}).map(([k, v]) => (
              <div key={k} className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">{k}</span>
                <span className="font-medium text-white">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* E-Commerce Abandoned Cart Recovery Hook */}
        <div className="border border-emerald-500/30 rounded-xl p-3 bg-emerald-950/20">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs mb-1">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Synced Shopify Cart (#8812)</span>
          </div>
          <div className="text-[11px] text-slate-300 mb-2">
            2 items in checkout ($428.00)
          </div>
          <button
            onClick={() => onSendMessage(activeConv.id, 'Hello! Here is your private 15% recovery voucher for your saved cart: SAVE15-RECOVER. Complete your order on WhatsApp now!')}
            className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold text-center transition-colors shadow-md"
          >
            Dispatch Cart Recovery
          </button>
        </div>
      </div>
    </div>
  );
};
