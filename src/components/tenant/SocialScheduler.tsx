import React, { useState } from 'react';
import { SocialPost } from '../../types.ts';
import {
  Share2,
  Sparkles,
  Calendar,
  Send,
  CheckCircle2,
  Image,
  Video,
  Clock,
  Eye,
  Layers,
} from 'lucide-react';

interface SocialSchedulerProps {
  posts: SocialPost[];
  onSchedulePost: (post: SocialPost) => void;
}

export const SocialScheduler: React.FC<SocialSchedulerProps> = ({
  posts,
  onSchedulePost,
}) => {
  const [content, setContent] = useState(
    '🚀 Transform your omnichannel marketing with WhatsOmni v3.0! Unify WhatsApp, Instagram, TikTok, LinkedIn and Telegram into one real-time command center.\n\n#Omnichannel #MetaAds #ConversationalAI'
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState<
    ('facebook' | 'instagram' | 'tiktok' | 'linkedin' | 'telegram')[]
  >(['facebook', 'instagram', 'linkedin']);
  const [previewPlatform, setPreviewPlatform] = useState<
    'facebook' | 'instagram' | 'tiktok' | 'linkedin' | 'telegram'
  >('instagram');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional & Engaging');
  const [generatingCopy, setGeneratingCopy] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('2026-10-10T15:00');

  const platformsConfig = [
    { id: 'facebook', label: 'Facebook Page' },
    { id: 'instagram', label: 'Instagram Reel/Post' },
    { id: 'tiktok', label: 'TikTok (9:16 Vertical Video)' },
    { id: 'linkedin', label: 'LinkedIn Organization' },
    { id: 'telegram', label: 'Telegram Broadcast' },
  ];

  const togglePlatform = (p: any) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((x) => x !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleGenerateAiCopy = async () => {
    if (!topic.trim()) return;
    setGeneratingCopy(true);

    try {
      const res = await fetch('/api/ai/social-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          platform: previewPlatform,
          tone,
        }),
      });
      const data = await res.json();
      if (data.content) {
        setContent(data.content);
      }
    } catch {
      setContent(
        `Elevate your reach with ${topic}!\n\n` +
          `Supercharge your customer engagement across 10 messaging networks with WhatsOmni v3.0! Turn clicks into sales with 1-click WhatsApp checkout and native forms.\n\n` +
          `#${topic.replace(/\s+/g, '')} #MarketingAutomation #SaaS #WhatsOmni`
      );
    } finally {
      setGeneratingCopy(false);
      setTopic('');
    }
  };

  const handleSchedule = () => {
    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      content,
      platforms: selectedPlatforms,
      scheduledFor: scheduledDate,
      status: 'scheduled',
      author: 'Demo User',
    };
    onSchedulePost(newPost);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Cross-Platform Social Posts & AI Scheduler
            </h1>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-mono px-2.5 py-0.5 rounded-lg border border-emerald-500/25 font-bold">
              5 Social Networks
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Simultaneously publish and schedule AI-crafted media posts to Facebook, Instagram Reels, TikTok, LinkedIn, and Telegram channels.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Composer & AI Generator */}
        <div className="lg:col-span-7 space-y-4">
          {/* Target Platforms Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Select Target Networks
            </div>
            <div className="flex flex-wrap gap-2">
              {platformsConfig.map((p) => {
                const isSelected = selectedPlatforms.includes(p.id as any);
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Copywriter Strip */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>AI Social Copywriter (Gemini 3.8 Flash)</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Topic: e.g., 'Spring Launch of Luxury Watch Collection with 20% discount'..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleGenerateAiCopy}
                disabled={generatingCopy || !topic.trim()}
                className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold transition-colors shrink-0"
              >
                {generatingCopy ? 'Writing...' : 'Generate Copy'}
              </button>
            </div>
          </div>

          {/* Post Content Composer */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider">
                Post Caption & Hashtags
              </label>
              <span className="text-[10px] text-slate-400 font-mono">{content.length} characters</span>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
            />

            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                  Schedule Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleSchedule}
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule Cross-Platform Post</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Platform Preview Card */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Live Feed Card Preview
            </span>
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {(['instagram', 'facebook', 'tiktok', 'linkedin'] as const).map((pf) => (
                <button
                  key={pf}
                  onClick={() => setPreviewPlatform(pf)}
                  className={`text-[10px] px-2 py-0.5 rounded capitalize font-semibold transition-colors ${
                    previewPlatform === pf ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {pf}
                </button>
              ))}
            </div>
          </div>

          {/* Realistic platform card simulation */}
          {previewPlatform === 'tiktok' ? (
            <div className="w-64 mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-3 shadow-2xl relative h-[420px] flex flex-col justify-between overflow-hidden">
              <div className="text-[10px] text-slate-400 flex items-center justify-between">
                <span>🎵 TikTok 9:16 Video API</span>
                <span>Active</span>
              </div>
              <div className="my-auto text-center py-10">
                <Video className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <span className="text-xs text-slate-400">9:16 Vertical Video Asset</span>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-xl text-[11px] text-white">
                <div className="font-bold mb-1">@whatsomni_tech</div>
                <div className="line-clamp-3 text-slate-300">{content}</div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                  W
                </div>
                <div>
                  <div className="text-xs font-bold text-white">WhatsOmni Enterprise</div>
                  <div className="text-[10px] text-slate-500">Just now · Public</div>
                </div>
              </div>

              <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                {content}
              </div>

              <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
                  alt="Post Asset"
                  className="w-full h-36 object-cover"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-around text-slate-400 text-xs">
                <span>👍 Like</span>
                <span>💬 Comment</span>
                <span>↗ Share</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
