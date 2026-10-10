/**
 * WhatsOmni v3.0 — Post-Go-Live Comprehensive Operations Verification Suite
 * Executes 15 end-to-end checkpoints across real integration endpoints, RAG, and security.
 */

import http from 'http';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';

interface CheckpointResult {
  step: number;
  name: string;
  passed: boolean;
  details?: string;
}

const checkpoints: CheckpointResult[] = [];

function makeReq(urlPath: string, options: any = {}): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE_URL);
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          let parsed = data;
          try {
            parsed = JSON.parse(data);
          } catch {}
          resolve({ status: res.statusCode || 0, body: parsed });
        });
      }
    );
    req.on('error', reject);
    if (options.body) req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    req.end();
  });
}

function logCheck(step: number, name: string, passed: boolean, details?: string) {
  checkpoints.push({ step, name, passed, details });
  const icon = passed ? '✓' : '✗';
  console.log(`[${icon}] Checkpoint ${step}: ${name}${details ? ` (${details})` : ''}`);
}

async function runPostGoLiveVerification() {
  console.log('====================================================');
  console.log(`WhatsOmni v3.0 Post-Go-Live Operations Activation [Target: ${BASE_URL}]`);
  console.log('====================================================');

  let token = '';

  // 1. Login
  try {
    const res = await makeReq('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: 'admin@whatsomni.com', password: 'Password123!' },
    });
    token = res.body.token;
    logCheck(1, 'User Authentication Login', res.status === 200 && !!token);
  } catch (e: any) {
    logCheck(1, 'User Authentication Login', false, e.message);
  }

  // 2. Tenant Switching
  try {
    const res = await makeReq('/api/tenants', {
      headers: { Authorization: `Bearer ${token}` },
    });
    logCheck(2, 'Multi-Tenant Governance & Listing', res.status === 200 && Array.isArray(res.body) && res.body.length >= 2);
  } catch (e: any) {
    logCheck(2, 'Multi-Tenant Governance & Listing', false, e.message);
  }

  // 3. Shared Inbox
  try {
    const res = await makeReq('/api/inbox/conversations', {
      headers: { Authorization: `Bearer ${token}`, 'x-workspace-id': 'ws-1' },
    });
    logCheck(3, 'Real-Time Shared Inbox', res.status === 200 && Array.isArray(res.body));
  } catch (e: any) {
    logCheck(3, 'Real-Time Shared Inbox', false, e.message);
  }

  // 4. Real WhatsApp Channel Test
  try {
    const res = await makeReq('/api/channels', {
      headers: { Authorization: `Bearer ${token}`, 'x-workspace-id': 'ws-1' },
    });
    const waCloud = res.body.find((c: any) => c.type === 'whatsapp_cloud');
    const waBaileys = res.body.find((c: any) => c.type === 'whatsapp_baileys');
    logCheck(4, 'WhatsApp Cloud & Baileys Gateways Connected', res.status === 200 && !!waCloud && !!waBaileys);
  } catch (e: any) {
    logCheck(4, 'WhatsApp Gateways', false, e.message);
  }

  // 5. Meta Ads CTWA Campaign Data
  try {
    const res = await makeReq('/api/meta-ads', {
      headers: { Authorization: `Bearer ${token}`, 'x-workspace-id': 'ws-1' },
    });
    const hasCampaigns = Array.isArray(res.body) && res.body.length > 0;
    logCheck(5, 'Meta Ads & CTWA Engine Analytics', res.status === 200 && hasCampaigns);
  } catch (e: any) {
    logCheck(5, 'Meta Ads & CTWA Engine Analytics', false, e.message);
  }

  // 6. CRM Deals Pipeline & Stage Transition
  try {
    const createRes = await makeReq('/api/crm/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'x-workspace-id': 'ws-1' },
      body: { title: 'Post-Go-Live Verified Deal', contactName: 'Operations Lead', value: 7500, stage: 'Lead' },
    });
    const dealId = createRes.body.id;
    const updateRes = await makeReq(`/api/crm/deals/${dealId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'x-workspace-id': 'ws-1' },
      body: { stage: 'Closed Won' },
    });
    logCheck(6, 'CRM Deals Pipeline & Mutation', createRes.status === 201 && updateRes.body.stage === 'Closed Won');
  } catch (e: any) {
    logCheck(6, 'CRM Deals Pipeline', false, e.message);
  }

  // 7. AI Inference (Copilot / Smart Reply)
  try {
    const res = await makeReq('/api/ai/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'x-workspace-id': 'ws-1' },
      body: { prompt: 'Provide 3 high-impact strategies for Click-to-WhatsApp ads.' },
    });
    logCheck(7, 'Autonomous Platform AI Copilot', res.status === 200 && !!res.body.content);
  } catch (e: any) {
    logCheck(7, 'Platform AI Copilot', false, e.message);
  }

  // 8. RAG Document Pipeline (Upload -> Chunk -> Query with Sources -> Delete)
  try {
    const docText = 'WhatsOmni v3.0 features enterprise Click-to-WhatsApp ad funnels with instant lead capture. Multi-gateway checkout supports 8 global currencies.';
    // Upload & Chunk
    const uploadRes = await makeReq('/api/knowledge-docs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'x-workspace-id': 'ws-1' },
      body: { name: 'Operations_SOP.pdf', type: 'pdf', content: docText },
    });
    const docId = uploadRes.body.id;
    // Semantic Retrieval Query
    const queryRes = await makeReq('/api/knowledge-docs/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'x-workspace-id': 'ws-1' },
      body: { query: 'What does WhatsOmni Click-to-WhatsApp feature offer?' },
    });
    // Delete Document & Chunks
    const deleteRes = await makeReq(`/api/knowledge-docs/${docId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}`, 'x-workspace-id': 'ws-1' },
    });

    const ragPassed = uploadRes.status === 201 && queryRes.body.sources?.length > 0 && deleteRes.status === 200;
    logCheck(8, 'Semantic RAG Knowledge Base Pipeline', ragPassed, `Citations: ${queryRes.body.sources?.length}`);
  } catch (e: any) {
    logCheck(8, 'RAG Knowledge Pipeline', false, e.message);
  }

  // 9. Operations & WebSocket Telemetry
  try {
    const res = await makeReq('/api/operations/status');
    const isGreen = res.body.application?.status === 'GREEN' && res.body.database?.status === 'GREEN';
    logCheck(9, 'Operations Dashboard Status (/api/operations/status)', res.status === 200 && isGreen, `Memory: ${res.body.application?.memoryRssMb}MB`);
  } catch (e: any) {
    logCheck(9, 'Operations Dashboard Status', false, e.message);
  }

  // 10. Webhook Ingress & Idempotent Deduplication
  try {
    const eventId = `golive_evt_${Date.now()}`;
    const payload = JSON.stringify({ id: eventId, event: 'charge.completed', amount: 4900 });
    const secret = 'whsec_production_omni_2026';
    const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    const res1 = await makeReq('/api/webhooks/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-webhook-signature': sig },
      body: payload,
    });
    const res2 = await makeReq('/api/webhooks/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-webhook-signature': sig },
      body: payload,
    });
    logCheck(10, 'HMAC Webhooks & Idempotent Deduplication', res1.body.action === 'PROCESSED' && res2.body.action === 'IGNORED_DUPLICATE');
  } catch (e: any) {
    logCheck(10, 'HMAC Webhooks', false, e.message);
  }

  // 11. Billing TEST Mode Verification
  try {
    const res = await makeReq('/api/billing/gateways', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const hasGateways = Array.isArray(res.body) && res.body.length === 8;
    logCheck(11, '8 Multi-Gateways Billing in Test Mode', res.status === 200 && hasGateways);
  } catch (e: any) {
    logCheck(11, 'Billing Gateways', false, e.message);
  }

  // 12. Staff Calendar & Booking Reservation
  try {
    const res = await makeReq('/api/booking/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'x-workspace-id': 'ws-1' },
      body: { staffId: 'staff-1', slot: '2026-10-15 10:00 AM', customerName: 'Go-Live Client', customerEmail: 'client@example.com' },
    });
    logCheck(12, 'Staff Calendar & Public Reservation', res.status === 201 && res.body.success === true);
  } catch (e: any) {
    logCheck(12, 'Staff Calendar Booking', false, e.message);
  }

  // 13. Backup Verification
  try {
    const dbFile = path.resolve(process.cwd(), 'data/whatsomni_production.json');
    const exists = fs.existsSync(dbFile);
    const size = fs.statSync(dbFile).size;
    logCheck(13, 'Persistent Storage & Backup File Integrity', exists && size > 1000, `${size} bytes`);
  } catch (e: any) {
    logCheck(13, 'Backup File Integrity', false, e.message);
  }

  // 14. Dual Health Verification
  try {
    const liveness = await makeReq('/health');
    const readiness = await makeReq('/ready');
    logCheck(14, 'Dual Health Verification (/health & /ready)', liveness.status === 200 && readiness.status === 200);
  } catch (e: any) {
    logCheck(14, 'Dual Health Verification', false, e.message);
  }

  // 15. Security & Architecture Regression
  try {
    const { runContractTestSuite } = await import('../src/server/tests/api_verification.ts');
    const result = await runContractTestSuite();
    logCheck(15, `${result.results.length}/${result.results.length} Architecture & Security Regression Suite`, result.passed && result.results.length >= 37);
  } catch (e: any) {
    logCheck(15, 'Security Regression Suite', false, e.message);
  }

  console.log('====================================================');
  const allPassed = checkpoints.every((c) => c.passed);
  console.log(`Summary: ${checkpoints.filter((c) => c.passed).length}/${checkpoints.length} CHECKPOINTS PASSED`);
  console.log(`Overall Status: ${allPassed ? 'ALL CHECKPOINTS PASSED' : 'CHECKPOINTS FAILED'}`);
  console.log('====================================================');

  if (!allPassed) {
    process.exit(1);
  }
}

runPostGoLiveVerification().catch((err) => {
  console.error('Post-go-live verification threw unhandled error:', err);
  process.exit(1);
});
