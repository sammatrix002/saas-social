-- ==============================================================================
-- WhatsOmni v3.0 — Enterprise Relational Database Schema (PostgreSQL 15+)
-- High-concurrency, multi-tenant partitioned architecture with B-tree indexing.
-- Covers all 24 core business tables + queue_jobs + audit_logs.
-- ==============================================================================

-- Enable UUID and Cryptographic extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tenants (Organizations)
CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    plan_id VARCHAR(64) NOT NULL DEFAULT 'plan-starter',
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    owner_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);

-- 2. Workspaces (Sub-divisions / Brands per Tenant)
CREATE TABLE IF NOT EXISTS workspaces (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    copilot_credits INT NOT NULL DEFAULT 500,
    flow_credits INT NOT NULL DEFAULT 10000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_workspaces_tenant ON workspaces(tenant_id);

-- 3. Users & RBAC Identity
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE SET NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'agent',
    salt VARCHAR(64) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_tenant_email ON users(tenant_id, email);

-- 4. Omnichannel Gateways & Accounts
CREATE TABLE IF NOT EXISTS channels (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE,
    type VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    account_handle VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'connected',
    badge_color VARCHAR(32) NOT NULL DEFAULT 'emerald',
    unread_count INT NOT NULL DEFAULT 0,
    credentials JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_channels_tenant_type ON channels(tenant_id, type);

-- 5. Contacts & Customer Profiles
CREATE TABLE IF NOT EXISTS contacts (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(64),
    email VARCHAR(255),
    avatar TEXT,
    lifecycle_stage VARCHAR(64),
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    source VARCHAR(64),
    assigned_agent VARCHAR(255),
    custom_fields JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_contacts_tenant_phone ON contacts(tenant_id, phone);

-- 6. Shared Inbox Conversations
CREATE TABLE IF NOT EXISTS conversations (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE,
    contact_id VARCHAR(64) REFERENCES contacts(id) ON DELETE SET NULL,
    channel VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'open',
    assigned_agent VARCHAR(255),
    last_message TEXT,
    last_message_time VARCHAR(64),
    unread_count INT NOT NULL DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_conversations_tenant_status ON conversations(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_conversations_updated ON conversations(tenant_id, updated_at DESC);

-- 7. Omnichannel Messages
CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(64) PRIMARY KEY,
    conversation_id VARCHAR(64) NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE SET NULL,
    sender VARCHAR(32) NOT NULL,
    sender_name VARCHAR(255),
    text TEXT NOT NULL,
    type VARCHAR(32) NOT NULL DEFAULT 'text',
    direction VARCHAR(16) NOT NULL DEFAULT 'inbound',
    external_message_id VARCHAR(128),
    channel VARCHAR(64),
    status VARCHAR(32) NOT NULL DEFAULT 'delivered',
    is_internal_note BOOLEAN NOT NULL DEFAULT FALSE,
    timestamp VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_messages_ext_id ON messages(external_message_id);

-- 8. Meta Ads & Click-to-WhatsApp Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    platform VARCHAR(32) NOT NULL DEFAULT 'both',
    headline VARCHAR(255),
    primary_text TEXT,
    call_to_action VARCHAR(64),
    budget_daily NUMERIC(12, 2) NOT NULL DEFAULT 100.00,
    currency VARCHAR(8) NOT NULL DEFAULT 'USD',
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    impressions BIGINT NOT NULL DEFAULT 0,
    clicks BIGINT NOT NULL DEFAULT 0,
    spend NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    leads_captured BIGINT NOT NULL DEFAULT 0,
    conversations_started BIGINT NOT NULL DEFAULT 0,
    ctwa_trigger_keyword VARCHAR(64),
    target_flow_id VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_campaigns_tenant ON campaigns(tenant_id, status);

-- 9. Sales CRM Kanban Deals
CREATE TABLE IF NOT EXISTS deals (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL DEFAULT 'Anonymous',
    contact_phone VARCHAR(64),
    stage VARCHAR(64) NOT NULL DEFAULT 'Lead',
    value NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(8) NOT NULL DEFAULT 'USD',
    assigned_agent VARCHAR(255),
    expected_close_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_deals_tenant_stage ON deals(tenant_id, stage);

-- 10. Visual Automation Flows
CREATE TABLE IF NOT EXISTS flows (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    node_count INT NOT NULL DEFAULT 0,
    nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
    edges JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. WhatsApp Native Flow Forms
CREATE TABLE IF NOT EXISTS flow_forms (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL DEFAULT 'General',
    screens INT NOT NULL DEFAULT 1,
    submissions INT NOT NULL DEFAULT 0,
    conversion_rate VARCHAR(32) NOT NULL DEFAULT '0%',
    status VARCHAR(32) NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Commerce Product Catalog Items
CREATE TABLE IF NOT EXISTS catalog_items (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(8) NOT NULL DEFAULT 'USD',
    sku VARCHAR(64),
    stock INT NOT NULL DEFAULT 0,
    image TEXT,
    category VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. AI Chatbots & Personas
CREATE TABLE IF NOT EXISTS chatbots (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    persona VARCHAR(255),
    system_prompt TEXT,
    temperature NUMERIC(3, 2) NOT NULL DEFAULT 0.7,
    model VARCHAR(64) NOT NULL DEFAULT 'gemini-3.8-flash',
    assigned_channels TEXT[] DEFAULT ARRAY[]::TEXT[],
    business_hours_only BOOLEAN NOT NULL DEFAULT FALSE,
    total_turns INT NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Semantic RAG Knowledge Base Docs & Chunks
CREATE TABLE IF NOT EXISTS knowledge_docs (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(32) NOT NULL DEFAULT 'pdf',
    chunk_count INT NOT NULL DEFAULT 0,
    uploaded_at TIMESTAMPTZ,
    size VARCHAR(32) NOT NULL,
    preview_content TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS knowledge_chunks (
    id VARCHAR(64) PRIMARY KEY,
    doc_id VARCHAR(64) NOT NULL REFERENCES knowledge_docs(id) ON DELETE CASCADE,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    indexed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_chunks_tenant_doc ON knowledge_chunks(tenant_id, doc_id);

-- 15. Social Media Scheduler Posts
CREATE TABLE IF NOT EXISTS social_posts (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    platforms TEXT[] DEFAULT ARRAY[]::TEXT[],
    scheduled_for TIMESTAMPTZ,
    status VARCHAR(32) NOT NULL DEFAULT 'scheduled',
    author VARCHAR(255),
    metrics JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. Anti-Ban Broadcast Campaigns
CREATE TABLE IF NOT EXISTS broadcasts (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    channel VARCHAR(64) NOT NULL,
    template_name VARCHAR(128),
    target_audience VARCHAR(128),
    total_recipients INT NOT NULL DEFAULT 0,
    sent INT NOT NULL DEFAULT 0,
    delivered INT NOT NULL DEFAULT 0,
    read INT NOT NULL DEFAULT 0,
    replied INT NOT NULL DEFAULT 0,
    failed INT NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'scheduled',
    delay_per_message_sec NUMERIC(4, 1) NOT NULL DEFAULT 5.0,
    jitter_window_sec NUMERIC(4, 1) NOT NULL DEFAULT 3.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. Staff & Scheduling Hosts
CREATE TABLE IF NOT EXISTS staff (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(64) NOT NULL DEFAULT 'Host',
    avatar TEXT,
    timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
    available_days TEXT[] DEFAULT ARRAY[]::TEXT[],
    booking_slug VARCHAR(64) UNIQUE,
    meeting_provider VARCHAR(64) NOT NULL DEFAULT 'google_meet',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. E-Commerce Abandoned Carts
CREATE TABLE IF NOT EXISTS abandoned_carts (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(64) NOT NULL,
    customer_email VARCHAR(255),
    store VARCHAR(64) NOT NULL DEFAULT 'Shopify',
    items JSONB DEFAULT '[]'::jsonb,
    cart_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(8) NOT NULL DEFAULT 'USD',
    abandoned_at TEXT,
    recovery_scheduled_at TEXT,
    coupon_code VARCHAR(64),
    recovery_status VARCHAR(32) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_carts_recovery ON abandoned_carts(tenant_id, recovery_status);

-- 19. Payment Gateway Integrations Vault
CREATE TABLE IF NOT EXISTS payment_gateways (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mode VARCHAR(32) NOT NULL DEFAULT 'test',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    region VARCHAR(64) NOT NULL DEFAULT 'Global',
    credentials JSONB DEFAULT '{}'::jsonb,
    supported_currencies TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. Multi-Currency Engine
CREATE TABLE IF NOT EXISTS currencies (
    code VARCHAR(8) PRIMARY KEY,
    symbol VARCHAR(8) NOT NULL,
    name VARCHAR(64) NOT NULL,
    exchange_rate_to_usd NUMERIC(12, 6) NOT NULL DEFAULT 1.0,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. Subscription Pricing Plans
CREATE TABLE IF NOT EXISTS plans (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tagline TEXT,
    badge VARCHAR(64),
    max_workspaces INT NOT NULL DEFAULT 1,
    max_channels INT NOT NULL DEFAULT 5,
    max_team_seats INT NOT NULL DEFAULT 3,
    flow_credits INT NOT NULL DEFAULT 1000,
    copilot_credits INT NOT NULL DEFAULT 500,
    monthly_prices JSONB DEFAULT '{}'::jsonb,
    annual_prices JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. RBAC Roles & Module Permissions
CREATE TABLE IF NOT EXISTS rbac_roles (
    module VARCHAR(64) PRIMARY KEY,
    display_name VARCHAR(255) NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT TRUE,
    "write" BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 23. Webhook Events & Idempotency Vault
CREATE TABLE IF NOT EXISTS webhook_events (
    id VARCHAR(64) PRIMARY KEY,
    event_id VARCHAR(128) NOT NULL,
    gateway VARCHAR(64) NOT NULL,
    payload JSONB NOT NULL,
    signature_provided BOOLEAN NOT NULL DEFAULT FALSE,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(32) NOT NULL DEFAULT 'PROCESSED',
    timestamp TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_webhook_event_id ON webhook_events(event_id);

-- 24. AI Telemetry & Token Cost Auditing
CREATE TABLE IF NOT EXISTS ai_telemetry_logs (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE,
    feature VARCHAR(64) NOT NULL,
    provider VARCHAR(64) NOT NULL,
    model VARCHAR(64) NOT NULL,
    prompt_tokens INT NOT NULL DEFAULT 0,
    comp_tokens INT NOT NULL DEFAULT 0,
    total_tokens INT NOT NULL DEFAULT 0,
    latency_ms INT NOT NULL DEFAULT 0,
    estimated_cost_usd NUMERIC(10, 6) NOT NULL DEFAULT 0.000000,
    timestamp TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_telemetry_tenant ON ai_telemetry_logs(tenant_id, created_at DESC);

-- 25. System Audit Trail
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) REFERENCES tenants(id) ON DELETE SET NULL,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE SET NULL,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(128) NOT NULL,
    resource VARCHAR(128) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON audit_logs(tenant_id, created_at DESC);

-- 26. Distributed Durable Job Queue
CREATE TABLE IF NOT EXISTS queue_jobs (
    id VARCHAR(64) PRIMARY KEY,
    type VARCHAR(64) NOT NULL,
    data JSONB NOT NULL,
    idempotency_key VARCHAR(128) UNIQUE,
    attempts INT NOT NULL DEFAULT 0,
    max_retries INT NOT NULL DEFAULT 3,
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    worker_id VARCHAR(64),
    locked_until TIMESTAMPTZ,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_queue_status_locked ON queue_jobs(status, locked_until);
CREATE INDEX IF NOT EXISTS idx_queue_idempotency ON queue_jobs(idempotency_key);
