<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Tenants Table
        Schema::create('tenants', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('owner_email')->index();
            $table->enum('status', ['active', 'suspended', 'trial'])->default('active');
            $table->string('plan_id')->default('plan-starter');
            $table->json('settings')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // 2. Workspaces Table (Multi-workspace per tenant)
        Schema::create('workspaces', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->string('name');
            $table->string('slug');
            $table->boolean('is_default')->default(false);
            $table->unsignedBigInteger('flow_credits')->default(10000);
            $table->unsignedBigInteger('copilot_credits')->default(250);
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->unique(['tenant_id', 'slug']);
        });

        // 3. Channels Table (10 channels)
        Schema::create('channels', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('workspace_id')->index();
            $table->enum('type', [
                'whatsapp_cloud', 'whatsapp_baileys', 'instagram', 'facebook',
                'tiktok', 'linkedin', 'telegram', 'sms', 'email', 'livechat'
            ]);
            $table->string('name');
            $table->string('account_handle');
            $table->enum('status', ['connected', 'disconnected', 'needs_reconnect'])->default('connected');
            $table->text('encrypted_credentials')->nullable();
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('workspace_id')->references('id')->on('workspaces')->onDelete('cascade');
        });

        // 4. Contacts Table
        Schema::create('contacts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('workspace_id')->index();
            $table->string('name');
            $table->string('phone')->nullable()->index();
            $table->string('email')->nullable()->index();
            $table->string('avatar')->nullable();
            $table->enum('lifecycle_stage', ['Lead', 'Prospect', 'Customer', 'VIP', 'Churned'])->default('Lead');
            $table->json('tags')->nullable();
            $table->json('custom_fields')->nullable();
            $table->boolean('opted_out')->default(false);
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('workspace_id')->references('id')->on('workspaces')->onDelete('cascade');
        });

        // 5. Conversations & Messages Tables
        Schema::create('conversations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('workspace_id')->index();
            $table->uuid('contact_id')->index();
            $table->uuid('channel_id')->nullable();
            $table->string('channel_type');
            $table->enum('status', ['open', 'pending', 'resolved'])->default('open');
            $table->string('assigned_agent')->nullable();
            $table->text('last_message')->nullable();
            $table->timestamp('last_message_at')->nullable()->index();
            $table->unsignedInteger('unread_count')->default(0);
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('workspace_id')->references('id')->on('workspaces')->onDelete('cascade');
            $table->foreign('contact_id')->references('id')->on('contacts')->onDelete('cascade');
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('workspace_id')->index();
            $table->uuid('conversation_id')->index();
            $table->enum('sender', ['customer', 'agent', 'bot', 'system']);
            $table->string('sender_name')->nullable();
            $table->text('text');
            $table->string('channel_type');
            $table->enum('delivery_status', ['sent', 'delivered', 'read', 'failed'])->default('sent');
            $table->boolean('is_internal_note')->default(false);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('workspace_id')->references('id')->on('workspaces')->onDelete('cascade');
            $table->foreign('conversation_id')->references('id')->on('conversations')->onDelete('cascade');
        });

        // 6. CRM Deals Table
        Schema::create('crm_deals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('workspace_id')->index();
            $table->uuid('contact_id')->nullable();
            $table->string('title');
            $table->enum('stage', ['Lead In', 'Contact Made', 'Qualified', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'])->default('Lead In');
            $table->decimal('value', 12, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            $table->string('assigned_agent')->nullable();
            $table->date('expected_close_date')->nullable();
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('workspace_id')->references('id')->on('workspaces')->onDelete('cascade');
        });

        // 7. Audit & Webhook Logs Tables
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->nullable()->index();
            $table->string('actor_email');
            $table->string('action');
            $table->json('payload')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('webhook_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('gateway');
            $table->string('event_id')->nullable()->index();
            $table->json('payload');
            $table->boolean('verified')->default(false);
            $table->string('status')->default('PROCESSED');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('webhook_events');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('crm_deals');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('conversations');
        Schema::dropIfExists('contacts');
        Schema::dropIfExists('channels');
        Schema::dropIfExists('workspaces');
        Schema::dropIfExists('tenants');
    }
};
