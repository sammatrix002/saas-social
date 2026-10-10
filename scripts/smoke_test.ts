/**
 * WhatsOmni v3.0 — Comprehensive Production Smoke Test Suite
 * Executes 13 production smoke checkpoints against live server endpoints.
 */

import http from 'http';
import crypto from 'crypto';

const BASE_URL = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';

interface SmokeResult {
  step: number;
  checkpoint: string;
  passed: boolean;
  details?: string;
}

const results: SmokeResult[] = [];

async function request(path: string, options: any = {}): Promise<{ status: number; headers: any; body: any }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions: http.RequestOptions = {
      method: options.method || 'GET',
      headers: options.headers || {},
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let parsed = data;
        try {
          parsed = JSON.parse(data);
        } catch {}
        resolve({ status: res.statusCode || 0, headers: res.headers, body: parsed });
      });
    });

    req.on('error', reject);

    if (options.body) {
      const payload = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
      req.write(payload);
    }
    req.end();
  });
}

function record(step: number, checkpoint: string, passed: boolean, details?: string) {
  results.push({ step, checkpoint, passed, details });
  const icon = passed ? '✓' : '✗';
  console.log(`[${icon}] Step ${step}: ${checkpoint}${details ? ` (${details})` : ''}`);
}

async function runSmokeTests() {
  console.log('====================================================');
  console.log(`WhatsOmni v3.0 Production Smoke Tests [Target: ${BASE_URL}]`);
  console.log('====================================================');

  let authToken = '';

  // 1. Application Liveness
  try {
    const res = await request('/health');
    record(1, 'Application Liveness (/health)', res.status === 200 && res.body.status === 'ok');
  } catch (err: any) {
    record(1, 'Application Liveness', false, err.message);
  }

  // 2. Application Readiness & Database
  try {
    const res = await request('/ready');
    record(2, 'Application Readiness & Database (/ready)', res.status === 200 && res.body.status === 'ready');
  } catch (err: any) {
    record(2, 'Application Readiness', false, err.message);
  }

  // 3. User Authentication Login
  try {
    const res = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: 'admin@whatsomni.com', password: 'Password123!' },
    });
    authToken = res.body.token || '';
    record(3, 'Authentication Login (/api/auth/login)', res.status === 200 && authToken.length > 0, `Token: ${authToken.slice(0, 10)}...`);
  } catch (err: any) {
    record(3, 'Authentication Login', false, err.message);
  }

  // 4. Identity & Navigation Context
  try {
    const res = await request('/api/auth/me', {
      headers: { Authorization: `Bearer ${authToken}`, 'x-workspace-id': 'ws-1' },
    });
    record(4, 'Identity & Navigation Context (/api/auth/me)', res.status === 200 && res.body.user?.role === 'superadmin');
  } catch (err: any) {
    record(4, 'Identity & Navigation Context', false, err.message);
  }

  // 5. Multi-Tenant Switching
  try {
    const res = await request('/api/tenants', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    record(5, 'Tenant Switching & Tenant Listing (/api/tenants)', res.status === 200 && Array.isArray(res.body) && res.body.length >= 2);
  } catch (err: any) {
    record(5, 'Tenant Switching', false, err.message);
  }

  // 6. Omnichannel Connectivity
  try {
    const res = await request('/api/channels', {
      headers: { Authorization: `Bearer ${authToken}`, 'x-workspace-id': 'ws-1' },
    });
    record(6, 'Omnichannel Messaging Hub (/api/channels)', res.status === 200 && Array.isArray(res.body) && res.body.length >= 10);
  } catch (err: any) {
    record(6, 'Omnichannel Messaging Hub', false, err.message);
  }

  // 7. Meta Ads & CTWA Engine
  try {
    const res = await request('/api/meta-ads', {
      headers: { Authorization: `Bearer ${authToken}`, 'x-workspace-id': 'ws-1' },
    });
    record(7, 'Meta Ads & CTWA Engine (/api/meta-ads)', res.status === 200 && Array.isArray(res.body));
  } catch (err: any) {
    record(7, 'Meta Ads & CTWA Engine', false, err.message);
  }

  // 8. CRM Contacts & Deals Pipeline
  try {
    const res = await request('/api/crm/deals', {
      headers: { Authorization: `Bearer ${authToken}`, 'x-workspace-id': 'ws-1' },
    });
    record(8, 'CRM Kanban Deals Pipeline (/api/crm/deals)', res.status === 200 && Array.isArray(res.body));
  } catch (err: any) {
    record(8, 'CRM Kanban Deals Pipeline', false, err.message);
  }

  // 9. AI Smart Reply / Copilot
  try {
    const res = await request('/api/ai/smart-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}`, 'x-workspace-id': 'ws-1' },
      body: { message: 'Can you tell me about your pricing plans?', customerName: 'Smoke Test Client' },
    });
    record(9, 'Platform AI Inference & Copilot (/api/ai/smart-reply)', res.status === 200 && Array.isArray(res.body.replies) && res.body.replies.length > 0);
  } catch (err: any) {
    record(9, 'Platform AI Inference', false, err.message);
  }

  // 10. Webhook Ingress, HMAC Verification & Idempotent Deduplication
  try {
    const eventId = `evt_smoke_test_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const payload = JSON.stringify({ id: eventId, event: 'payment.success', amount: 9900 });
    const secret = process.env.WEBHOOK_SIGNING_SECRET || 'whsec_production_omni_2026';
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    // First delivery (processed)
    const res1 = await request('/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-signature': signature,
      },
      body: payload,
    });

    // Replayed delivery (must be recognized as duplicate and ignored)
    const res2 = await request('/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-signature': signature,
      },
      body: payload,
    });

    const isVerified = res1.status === 200 && res1.body.verified === true && res1.body.action === 'PROCESSED';
    const isDeduplicated = res2.status === 200 && res2.body.duplicate === true && res2.body.action === 'IGNORED_DUPLICATE';

    record(10, 'Webhook Ingress HMAC & Idempotent Deduplication (/api/webhooks/stripe)', isVerified && isDeduplicated, 'Processed once, replayed ignored');
  } catch (err: any) {
    record(10, 'Webhook Ingress', false, err.message);
  }

  // 11. Security Headers Verification
  try {
    const res = await request('/health');
    const hasNosniff = res.headers['x-content-type-options'] === 'nosniff';
    const hasSameorigin = res.headers['x-frame-options'] === 'SAMEORIGIN';
    const hasRequestId = !!res.headers['x-request-id'];
    record(11, 'HTTP Security Headers (nosniff, SAMEORIGIN, x-request-id)', hasNosniff && hasSameorigin && hasRequestId);
  } catch (err: any) {
    record(11, 'HTTP Security Headers', false, err.message);
  }

  // 12. Rate Limiting Protection (Auth Limiter)
  try {
    const res = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: 'bad@login.com', password: 'bad' },
    });
    const hasRateHeaders = res.headers['x-ratelimit-limit'] !== undefined;
    record(12, 'Sliding-Window Rate Limiting Headers', hasRateHeaders);
  } catch (err: any) {
    record(12, 'Rate Limiting Protection', false, err.message);
  }

  // 13. Production Error Handling (Never leak stack traces)
  try {
    const res = await request('/api/unknown-broken-route');
    const safeError = res.status === 404 && typeof res.body.error === 'string' && !JSON.stringify(res.body).includes('at Object.');
    record(13, 'Safe Production Error Handling (no stack trace leak)', safeError);
  } catch (err: any) {
    record(13, 'Production Error Handling', false, err.message);
  }

  console.log('====================================================');
  const allPassed = results.every((r) => r.passed);
  console.log(`Smoke Test Summary: ${results.filter((r) => r.passed).length}/${results.length} PASSED`);
  console.log(`Overall Result: ${allPassed ? 'ALL CHECKPOINTS PASSED' : 'CHECKPOINTS FAILED'}`);
  console.log('====================================================');

  if (!allPassed) {
    process.exit(1);
  }
}

runSmokeTests().catch((err) => {
  console.error('Smoke tests execution threw an unhandled error:', err);
  process.exit(1);
});
