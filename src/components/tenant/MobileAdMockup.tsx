import React, { useState } from 'react';
import { MessageSquare, Eye, MoreHorizontal, Globe, Heart, Send, Bookmark } from 'lucide-react';
import { MetaAdCampaign } from '../../types.ts';

interface MobileAdMockupProps {
  campaign: MetaAdCampaign;
}

export const MobileAdMockup: React.FC<MobileAdMockupProps> = ({ campaign }) => {
  const [platformTab, setPlatformTab] = useState<'facebook' | 'instagram'>('facebook');
  const [hasLiked, setHasLiked] = useState(false);

  return (
    <div className="bg-[#10182A] border border-[#1E2B45] rounded-2xl p-5 shadow-xl shadow-black/40 flex flex-col justify-between">
      {/* Header & Platform Switcher */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#1E2B45] mb-4 gap-2">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Live Meta Ad Smartphone Preview
          </h3>
        </div>

        <div className="flex items-center p-0.5 rounded-xl bg-[#0A1020] border border-[#1E2B45]">
          <button
            onClick={() => setPlatformTab('facebook')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              platformTab === 'facebook'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Facebook Feed
          </button>
          <button
            onClick={() => setPlatformTab('instagram')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              platformTab === 'instagram'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Instagram Story
          </button>
        </div>
      </div>

      {/* Realistic Smartphone Frame */}
      <div className="max-w-[320px] mx-auto w-full bg-[#070B14] border-2 border-[#1E2B45] rounded-[38px] p-2.5 shadow-2xl shadow-black/80 relative">
        {/* Dynamic Island / Speaker notch */}
        <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-2 border border-[#1E2B45]/50 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-slate-800" />
        </div>

        {platformTab === 'facebook' ? (
          /* Facebook Mobile Feed Simulator */
          <div className="bg-[#0A1020] rounded-[26px] overflow-hidden border border-[#1E2B45]/60 text-xs">
            {/* Header info */}
            <div className="p-3 flex items-center justify-between border-b border-[#1E2B45]/40 bg-[#0A1020]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-extrabold text-white text-xs shadow-sm">
                  W
                </div>
                <div>
                  <div className="font-bold text-white text-xs leading-tight">WhatsOmni Official</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <span>Sponsored</span>
                    <span>·</span>
                    <Globe className="w-2.5 h-2.5 text-slate-400" />
                  </div>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>

            {/* Ad Primary text */}
            <div className="px-3 py-2 text-[11px] text-slate-200 leading-relaxed">
              {campaign.primaryText}
            </div>

            {/* Media Creative */}
            <div className="relative aspect-video bg-slate-900 overflow-hidden">
              <img
                src={campaign.mediaUrl}
                alt="Meta Creative"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-[#070B14]/85 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-mono text-cyan-300 font-bold border border-cyan-500/30">
                Trigger: {campaign.ctwaTriggerKeyword}
              </div>
            </div>

            {/* Headline and CTWA Conversion CTA */}
            <div className="p-3 bg-[#10182A] border-t border-[#1E2B45] space-y-2">
              <div className="text-[9px] text-slate-400 uppercase font-semibold font-mono tracking-wider">
                WHATSAPP.COM · CHAT DIRECTLY
              </div>
              <div className="font-extrabold text-white text-xs leading-snug">
                {campaign.headline}
              </div>

              {/* Conversion WhatsApp Button */}
              <button
                onClick={() => alert(`Launching WhatsApp conversation with keyword ${campaign.ctwaTriggerKeyword}!`)}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all active:scale-95"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Send WhatsApp Message</span>
              </button>
            </div>

            {/* Social reaction bar */}
            <div className="px-3 py-2 border-t border-[#1E2B45]/40 flex items-center justify-between text-slate-400 text-[11px]">
              <button
                onClick={() => setHasLiked(!hasLiked)}
                className={`flex items-center gap-1 ${hasLiked ? 'text-red-400 font-bold' : ''}`}
              >
                <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                <span>{hasLiked ? '385' : '384'}</span>
              </button>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>94 chats</span>
              </span>
              <span className="flex items-center gap-1">
                <Send className="w-3.5 h-3.5" />
                <span>Share</span>
              </span>
            </div>
          </div>
        ) : (
          /* Instagram Story Simulator */
          <div className="relative aspect-[9/16] bg-slate-900 rounded-[26px] overflow-hidden border border-[#1E2B45] flex flex-col justify-between p-3.5 text-white">
            <img
              src={campaign.mediaUrl}
              alt="Story Creative"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90 pointer-events-none" />

            {/* Story Top Header */}
            <div className="relative z-10 space-y-1.5">
              <div className="w-full bg-white/30 h-1 rounded-full overflow-hidden">
                <div className="bg-white h-full w-2/3" />
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 p-0.5">
                    <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center font-bold text-[9px]">
                      W
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-[11px] leading-tight">whatsomni.app</div>
                    <div className="text-[9px] text-slate-300">Sponsored</div>
                  </div>
                </div>
                <MoreHorizontal className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            {/* Story Bottom CTWA Box */}
            <div className="relative z-10 space-y-2">
              <div className="bg-black/65 backdrop-blur-md p-3 rounded-2xl border border-white/10 space-y-1">
                <div className="font-extrabold text-xs leading-snug">{campaign.headline}</div>
                <div className="text-[10px] text-slate-300 line-clamp-2">
                  {campaign.primaryText}
                </div>
              </div>

              <button
                onClick={() => alert(`Launching WhatsApp chat from Instagram Story with ${campaign.ctwaTriggerKeyword}!`)}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all active:scale-95"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
