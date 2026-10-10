import React, { useState } from 'react';
import {
  TenantTab,
  TenantWorkspace,
  ChannelInfo,
  Conversation,
  Contact,
  MetaAdCampaign,
  FlowNode,
  FlowEdge,
  FlowTemplate,
  WhatsAppFlowForm,
  CatalogItem,
  AiChatBot,
  KnowledgeDoc,
  SocialPost,
  BroadcastCampaign,
  CrmDeal,
  StaffMember,
  AbandonedCart,
  RolePermission,
} from '../../types.ts';
import { Sidebar } from '../navigation/Sidebar.tsx';
import { TenantDashboard } from './TenantDashboard.tsx';
import { SharedInbox } from './SharedInbox.tsx';
import { MetaAdsManager } from './MetaAdsManager.tsx';
import { WhatsAppFlowForms } from './WhatsAppFlowForms.tsx';
import { WhatsAppCatalog } from './WhatsAppCatalog.tsx';
import { FlowBuilder } from './FlowBuilder.tsx';
import { AiChatBots } from './AiChatBots.tsx';
import { SocialScheduler } from './SocialScheduler.tsx';
import { BroadcastCampaigns } from './BroadcastCampaigns.tsx';
import { CrmDealsPipeline } from './CrmDealsPipeline.tsx';
import { StaffCalendarBooking } from './StaffCalendarBooking.tsx';
import { EcommerceRecovery } from './EcommerceRecovery.tsx';
import { AiTelemetry } from './AiTelemetry.tsx';
import { RbacSettings } from './RbacSettings.tsx';

interface TenantLayoutProps {
  currentWorkspace: TenantWorkspace;
  channels: ChannelInfo[];
  conversations: Conversation[];
  contacts: Contact[];
  campaigns: MetaAdCampaign[];
  flowNodes: FlowNode[];
  flowEdges: FlowEdge[];
  flowTemplates: FlowTemplate[];
  flowForms: WhatsAppFlowForm[];
  catalogItems: CatalogItem[];
  chatbots: AiChatBot[];
  knowledgeDocs: KnowledgeDoc[];
  socialPosts: SocialPost[];
  broadcasts: BroadcastCampaign[];
  deals: CrmDeal[];
  staff: StaffMember[];
  abandonedCarts: AbandonedCart[];
  rbacPermissions: RolePermission[];
  onSendMessage: (conversationId: string, text: string, isInternalNote?: boolean) => void;
  onDispatchFlowForm: (conversationId: string, formTitle: string) => void;
  onDispatchCatalog: (conversationId: string, itemName: string) => void;
  onCreateCampaign: (camp: MetaAdCampaign) => void;
  onToggleCampaignStatus: (id: string) => void;
  onSchedulePost: (post: SocialPost) => void;
  onToggleBroadcastStatus: (id: string, status: any) => void;
  onAddDeal: (deal: CrmDeal) => void;
  onUpdateDealStage: (dealId: string, stage: any) => void;
  onDispatchCartRecovery: (cartId: string) => void;
}

export const TenantLayout: React.FC<TenantLayoutProps> = ({
  currentWorkspace,
  channels,
  conversations,
  contacts,
  campaigns,
  flowNodes,
  flowEdges,
  flowTemplates,
  flowForms,
  catalogItems,
  chatbots,
  knowledgeDocs,
  socialPosts,
  broadcasts,
  deals,
  staff,
  abandonedCarts,
  rbacPermissions,
  onSendMessage,
  onDispatchFlowForm,
  onDispatchCatalog,
  onCreateCampaign,
  onToggleCampaignStatus,
  onSchedulePost,
  onToggleBroadcastStatus,
  onAddDeal,
  onUpdateDealStage,
  onDispatchCartRecovery,
}) => {
  // Default to ctwa_ads to showcase the primary reference screen
  const [activeTab, setActiveTab] = useState<TenantTab>('ctwa_ads');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#070B14]">
      {/* 260px Fixed Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        workspace={currentWorkspace}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Independently Scrollable Main Viewport */}
      <main className="flex-1 h-full overflow-y-auto bg-[#070B14] p-5 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <TenantDashboard
            workspace={currentWorkspace}
            channels={channels}
            conversations={conversations}
            campaigns={campaigns}
            deals={deals}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'inbox' && (
          <SharedInbox
            channels={channels}
            conversations={conversations}
            contacts={contacts}
            flowForms={flowForms}
            catalogItems={catalogItems}
            onSendMessage={onSendMessage}
            onDispatchFlowForm={onDispatchFlowForm}
            onDispatchCatalog={onDispatchCatalog}
          />
        )}

        {activeTab === 'ctwa_ads' && (
          <MetaAdsManager
            campaigns={campaigns}
            onCreateCampaign={onCreateCampaign}
            onToggleStatus={onToggleCampaignStatus}
          />
        )}

        {activeTab === 'flow_forms' && (
          <WhatsAppFlowForms
            flowForms={flowForms}
            onPreviewForm={() => {}}
          />
        )}

        {activeTab === 'catalog' && (
          <WhatsAppCatalog
            catalogItems={catalogItems}
            onLaunchCart={() => {}}
          />
        )}

        {activeTab === 'flow_builder' && (
          <FlowBuilder
            initialNodes={flowNodes}
            initialEdges={flowEdges}
            templates={flowTemplates}
          />
        )}

        {activeTab === 'chatbots' && (
          <AiChatBots
            chatbots={chatbots}
            knowledgeDocs={knowledgeDocs}
          />
        )}

        {activeTab === 'social_scheduler' && (
          <SocialScheduler
            posts={socialPosts}
            onSchedulePost={onSchedulePost}
          />
        )}

        {activeTab === 'broadcasts' && (
          <BroadcastCampaigns
            campaigns={broadcasts}
            onToggleStatus={onToggleBroadcastStatus}
          />
        )}

        {activeTab === 'crm_deals' && (
          <CrmDealsPipeline
            deals={deals}
            contacts={contacts}
            onAddDeal={onAddDeal}
            onUpdateDealStage={onUpdateDealStage}
          />
        )}

        {activeTab === 'calendar_booking' && (
          <StaffCalendarBooking
            staff={staff}
            onOpenPublicBooking={() => {}}
          />
        )}

        {activeTab === 'ecommerce' && (
          <EcommerceRecovery
            abandonedCarts={abandonedCarts}
            onDispatchRecovery={onDispatchCartRecovery}
          />
        )}

        {activeTab === 'ai_telemetry' && <AiTelemetry />}

        {activeTab === 'rbac_settings' && (
          <RbacSettings initialPermissions={rbacPermissions} />
        )}
      </main>
    </div>
  );
};
