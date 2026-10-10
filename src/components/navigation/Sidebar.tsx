import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  TrendingUp,
  Smartphone,
  ShoppingBag,
  Workflow,
  Bot,
  Share2,
  Send,
  Users,
  Calendar,
  Layers,
  Cpu,
  Shield,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { TenantTab, TenantWorkspace } from '../../types.ts';
import { SidebarNavItem } from './SidebarNavItem.tsx';

interface SidebarProps {
  activeTab: TenantTab;
  onSelectTab: (tab: TenantTab) => void;
  workspace: TenantWorkspace;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  workspace,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Workspace Overview', icon: LayoutDashboard },
    { id: 'inbox', label: 'Real-time Shared Inbox', icon: MessageSquare, badge: '10' },
    { id: 'ctwa_ads', label: 'Meta Ads & CTWA Engine', icon: TrendingUp, badge: 'New' },
    { id: 'flow_forms', label: 'Native WhatsApp Flows', icon: Smartphone, badge: '0% Drop' },
    { id: 'catalog', label: 'Catalog & Cart Checkout', icon: ShoppingBag },
    { id: 'flow_builder', label: 'Visual Flow Builder', icon: Workflow, badge: 'AI' },
    { id: 'chatbots', label: 'AI ChatBots & RAG', icon: Bot },
    { id: 'social_scheduler', label: 'Social Media Scheduler', icon: Share2 },
    { id: 'broadcasts', label: 'Anti-Ban Broadcasts', icon: Send },
    { id: 'crm_deals', label: 'Kanban Deals CRM', icon: Users },
    { id: 'calendar_booking', label: 'Staff Calendar Booking', icon: Calendar },
    { id: 'ecommerce', label: 'Shopify / Woo Recovery', icon: Layers },
    { id: 'ai_telemetry', label: 'AI Token Telemetry', icon: Cpu },
    { id: 'rbac_settings', label: '19-Module RBAC Roles', icon: Shield },
  ];

  return (
    <aside
      className={`h-full border-r border-[#1E2B45] bg-[#0A1020] flex flex-col justify-between transition-all duration-200 shrink-0 select-none ${
        isCollapsed ? 'w-16' : 'w-[260px]'
      }`}
    >
      {/* Top Header & Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <div className="px-2 py-2 flex items-center justify-between mb-1">
          {!isCollapsed && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Workspace Navigation
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#10182A] transition-colors ml-auto"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.id}
              id={item.id}
              label={item.label}
              icon={item.icon}
              badge={item.badge}
              isActive={activeTab === item.id}
              isCollapsed={isCollapsed}
              onClick={() => onSelectTab(item.id as TenantTab)}
            />
          ))}
        </nav>
      </div>

      {/* Bottom Sidebar Footer */}
      <div className="p-3.5 border-t border-[#1E2B45] bg-[#070B14]/80 shrink-0">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Remaining Credits:</span>
              <span className="text-emerald-400 font-extrabold font-mono tabular-nums text-sm">
                {workspace.copilotCreditsRemaining || 980}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#10182A] rounded-full h-1.5 overflow-hidden border border-[#1E2B45]">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round(((workspace.copilotCreditsRemaining || 980) / 1000) * 100)
                  )}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>WebSockets (8080)</span>
              </span>
              <span className="text-emerald-400 font-semibold font-mono">Live</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 py-1" title="Remaining Credits: 980">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-mono text-emerald-400 font-bold">980</span>
          </div>
        )}
      </div>
    </aside>
  );
};
