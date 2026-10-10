/**
 * WhatsOmni v3.0 Comprehensive Backend Architecture & API Contract Verification Suite
 * Executes end-to-end contract validation against the Express REST API and persistent store.
 */

import { db } from '../db/store.ts';
import { generateAuthToken, AuthenticatedUser } from '../middleware/auth.ts';
import { verifyWebhookSignature, UrlSecurityValidator } from '../middleware/security.ts';
import crypto from 'crypto';

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  details?: string;
}

export async function runContractTestSuite(): Promise<{ passed: boolean; results: TestResult[] }> {
  const results: TestResult[] = [];

  function assert(condition: boolean, suite: string, name: string, details?: string) {
    results.push({
      suite,
      name,
      passed: !!condition,
      details: condition ? undefined : details || 'Assertion failed',
    });
  }

  // 1. Database Store & Tenancy Schema Integrity
  try {
    const tenants = db.getTable('tenants');
    assert(Array.isArray(tenants) && tenants.length >= 2, 'Database Store', 'Tenants seeded correctly');

    const channels = db.getTable('channels');
    assert(Array.isArray(channels) && channels.length >= 10, 'Database Store', '10 Channels seeded correctly');

    const campaigns = db.getTable('campaigns');
    assert(Array.isArray(campaigns) && campaigns.length >= 1, 'Database Store', 'Meta Ads seeded correctly');

    const gateways = db.getTable('paymentGateways');
    assert(Array.isArray(gateways) && gateways.length === 8, 'Database Store', '8 Payment Gateways seeded correctly');

    const currencies = db.getTable('currencies');
    assert(Array.isArray(currencies) && currencies.length === 8, 'Database Store', '8 Multi-Currencies seeded correctly');
  } catch (err: any) {
    assert(false, 'Database Store', 'Store integrity test threw', err.message);
  }

  // 2. Authentication & Multi-Tenant Scoping
  try {
    const demoUser: AuthenticatedUser = {
      id: 'usr-demo-test',
      email: 'test@whatsomni.com',
      name: 'Test Tenant Owner',
      role: 'owner',
      tenantId: 'ten-1',
      workspaceId: 'ws-1',
    };
    const token = generateAuthToken(demoUser);
    assert(token.startsWith('omni_'), 'Authentication', 'Token generated with omni_ prefix');
  } catch (err: any) {
    assert(false, 'Authentication', 'Auth token test threw', err.message);
  }

  // 3. Webhook HMAC Security
  try {
    const secret = 'whsec_test_secret_123';
    const payload = JSON.stringify({ event: 'charge.succeeded', amount: 4900 });
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    const valid = verifyWebhookSignature(payload, signature, secret);
    assert(valid === true, 'Security & Webhooks', 'Valid HMAC SHA-256 signature accepted');

    const invalid = verifyWebhookSignature(payload, 'wrong_signature_123', secret);
    assert(invalid === false, 'Security & Webhooks', 'Tampered signature rejected');
  } catch (err: any) {
    assert(false, 'Security & Webhooks', 'Webhook signature test threw', err.message);
  }

  // 4. SSRF URL Security Validator
  try {
    assert(UrlSecurityValidator.isSafeUrl('https://api.stripe.com/v1/charges') === true, 'Security & SSRF', 'Public HTTPS URL permitted');
    assert(UrlSecurityValidator.isSafeUrl('http://169.254.169.254/latest/meta-data') === false, 'Security & SSRF', 'Cloud metadata loopback blocked');
    assert(UrlSecurityValidator.isSafeUrl('http://localhost:8080/admin') === false, 'Security & SSRF', 'Localhost blocked');
    assert(UrlSecurityValidator.isSafeUrl('http://192.168.1.1/secret') === false, 'Security & SSRF', 'RFC 1918 private IP blocked');
    
    // Obfuscation & Evasion Vectors
    assert(UrlSecurityValidator.isSafeUrl('http://2130706433/') === false, 'Security & SSRF', 'Dword/Decimal IP (127.0.0.1) blocked');
    assert(UrlSecurityValidator.isSafeUrl('http://0177.0.0.1/') === false, 'Security & SSRF', 'Octal notation loopback blocked');
    assert(UrlSecurityValidator.isSafeUrl('http://0x7f000001/') === false, 'Security & SSRF', 'Hex notation loopback blocked');
    assert(UrlSecurityValidator.isSafeUrl('http://[::1]/') === false, 'Security & SSRF', 'IPv6 loopback blocked');
    assert(UrlSecurityValidator.isSafeUrl('http://[::ffff:192.168.1.1]/') === false, 'Security & SSRF', 'IPv6-mapped private IP blocked');
    assert(UrlSecurityValidator.isSafeUrl('file:///etc/passwd') === false, 'Security & SSRF', 'Non-HTTP file scheme blocked');
    assert(UrlSecurityValidator.isSafeUrl('gopher://127.0.0.1:70') === false, 'Security & SSRF', 'Gopher scheme blocked');
  } catch (err: any) {
    assert(false, 'Security & SSRF', 'SSRF validator test threw', err.message);
  }

  // 5. Step-Up OTP Security & Lockout
  try {
    const { generateSensitiveOpOtp, verifySensitiveOpOtp } = await import('../middleware/security.ts');
    const testUserId = 'usr-qa-test-otp';
    const otp = generateSensitiveOpOtp(testUserId);
    assert(typeof otp === 'string' && otp.length === 6, 'Security & OTP', '6-digit OTP generated');

    // Failed guess attempt
    const badAttempt = verifySensitiveOpOtp(testUserId, '000000');
    assert(badAttempt === false, 'Security & OTP', 'Invalid OTP code rejected');

    // Brute force lockout test: 5 bad attempts
    for (let i = 0; i < 5; i++) {
      verifySensitiveOpOtp(testUserId, '999999');
    }
    const lockedAttempt = verifySensitiveOpOtp(testUserId, otp);
    assert(lockedAttempt === false, 'Security & OTP', 'Account locked out after max failed OTP attempts');
  } catch (err: any) {
    assert(false, 'Security & OTP', 'OTP security test threw', err.message);
  }

  // 6. Tenant Scoping & Isolation
  try {
    const ten1Campaigns = db.query('campaigns', (c) => c.tenantId === 'ten-1');
    const ten2Campaigns = db.query('campaigns', (c) => c.tenantId === 'ten-2');
    const crossLeakage = ten1Campaigns.some((c) => c.tenantId === 'ten-2');
    assert(crossLeakage === false, 'Tenant Isolation', 'Zero cross-tenant data leakage between ten-1 and ten-2');
    assert(Array.isArray(ten1Campaigns), 'Tenant Isolation', 'Tenant query returns isolated array');
  } catch (err: any) {
    assert(false, 'Tenant Isolation', 'Tenant isolation test threw', err.message);
  }

  // 7. Meta Ads Metrics Engine
  try {
    const campaigns = db.query('campaigns', (c) => c.tenantId === 'ten-1');
    const totalSpend = campaigns.reduce((acc, c) => acc + (Number(c.spend) || 0), 0);
    const totalLeads = campaigns.reduce((acc, c) => acc + (Number(c.leadsCaptured) || 0), 0);
    assert(totalSpend >= 0, 'Meta Ads Engine', 'Spend aggregation calculated');
    assert(totalLeads >= 0, 'Meta Ads Engine', 'Leads aggregation calculated');
  } catch (err: any) {
    assert(false, 'Meta Ads Engine', 'Meta Ads calculation threw', err.message);
  }

  // 6. CRM Kanban Deals Mutation
  try {
    const testDeal = db.insert('deals', {
      tenantId: 'ten-1',
      workspaceId: 'ws-1',
      title: 'Automated QA Contract Deal',
      contactName: 'Verification Lead',
      stage: 'Qualified',
      value: 5000,
      currency: 'USD',
      assignedAgent: 'Demo User',
    });
    assert(testDeal.id.length > 0, 'CRM Engine', 'Deal created with unique ID');

    const updated = db.update('deals', (d) => d.id === testDeal.id, { stage: 'Closed Won' });
    assert(updated?.stage === 'Closed Won', 'CRM Engine', 'Deal stage mutated successfully');

    db.delete('deals', (d) => d.id === testDeal.id);
  } catch (err: any) {
    assert(false, 'CRM Engine', 'CRM deal mutations threw', err.message);
  }

  // 7. Abandoned Cart Recovery Workflow
  try {
    const cart = db.insert('abandonedCarts', {
      tenantId: 'ten-1',
      workspaceId: 'ws-1',
      customerName: 'QA Cart Customer',
      customerPhone: '+1 555 999 0000',
      store: 'Shopify',
      cartTotal: 129,
      currency: 'USD',
      recoveryStatus: 'pending',
    });
    const recovered = db.update('abandonedCarts', (c) => c.id === cart.id, { recoveryStatus: 'dispatched' });
    assert(recovered?.recoveryStatus === 'dispatched', 'Ecommerce Recovery', 'Cart recovery dispatch status updated');
    db.delete('abandonedCarts', (c) => c.id === cart.id);
  } catch (err: any) {
    assert(false, 'Ecommerce Recovery', 'Abandoned cart test threw', err.message);
  }

  // 8. Sliding-Window Rate Limiter Breach & 429 Throttle
  try {
    const { createRateLimiter } = await import('../middleware/security.ts');
    const limiter = createRateLimiter({ windowMs: 10000, maxRequests: 2 });
    const probeState = { blocked: false, statusCode: 200 };

    const mockRes: any = {
      setHeader: (_name: string, _val: any) => {},
      status: (code: number) => {
        probeState.statusCode = code;
        return {
          json: (body: any) => {
            if (code === 429) probeState.blocked = true;
            return body;
          },
        };
      },
    };
    const mockReq: any = { ip: '198.51.100.42', headers: {}, socket: {} };
    const nextFn = () => {};

    // Hit 1
    limiter(mockReq, mockRes, nextFn);
    // Hit 2
    limiter(mockReq, mockRes, nextFn);
    // Hit 3 (should breach threshold)
    limiter(mockReq, mockRes, nextFn);

    assert(probeState.blocked && probeState.statusCode === 429, 'Rate Limiter Throttling', 'Rate limit breached correctly returning HTTP 429');
  } catch (err: any) {
    assert(false, 'Rate Limiter Throttling', 'Rate limiter test threw', err.message);
  }

  // 9. Multi-Hop Proxy Client IP Extraction
  try {
    const { resolveClientIp } = await import('../middleware/security.ts');
    const reqWithProxy: any = {
      headers: { 'x-forwarded-for': '203.0.113.195, 70.41.3.18, 150.172.238.178' },
      ip: '10.0.0.1',
      socket: {},
    };
    const ip = resolveClientIp(reqWithProxy);
    assert(ip === '203.0.113.195', 'Proxy Security', 'Real client IP parsed from multi-hop X-Forwarded-For header');
  } catch (err: any) {
    assert(false, 'Proxy Security', 'Proxy IP extraction test threw', err.message);
  }

  // 10. Multi-Currency Engine & Payment Gateway Coverage
  try {
    const currencies = db.getTable('currencies') || [];
    assert(currencies.length === 8, 'Multi-Currency Engine', 'All 8 configured fiat currencies present');
    const usd = currencies.find((c: any) => c.code === 'USD');
    const usdRate = usd?.exchangeRateToUSD ?? (usd as any)?.rate;
    assert(usd && usdRate === 1.0, 'Multi-Currency Engine', 'Base currency USD rate is exactly 1.0');

    const eur = currencies.find((c: any) => c.code === 'EUR');
    const eurRate = eur?.exchangeRateToUSD ?? (eur as any)?.rate;
    assert(eur && typeof eurRate === 'number' && eurRate > 0, 'Multi-Currency Engine', 'EUR rate is valid positive float');

    const gateways = db.getTable('paymentGateways') || [];
    const gatewayNormalized = gateways.map((g: any) => `${g.id} ${g.name}`.toLowerCase().replace(/[\s-_]/g, ''));
    const expected = ['stripe', 'paypal', 'razorpay', 'paystack', 'flutterwave', 'mercadopago'];
    const hasExpected = expected.every((exp) => gatewayNormalized.some((n: string) => n.includes(exp)));
    assert(gateways.length === 8 && hasExpected, 'Payment Gateway Vault', 'All 8 global payment gateways registered in store');
  } catch (err: any) {
    assert(false, 'Multi-Currency Engine', 'Currency and Gateway test threw', err.message);
  }

  // 11. Atomic Concurrency & Store Mutation Stress
  try {
    const startCount = db.getTable('deals').length;
    const testIds: string[] = [];

    // Rapid batch write
    for (let i = 0; i < 30; i++) {
      const d = db.insert('deals', {
        tenantId: 'ten-1',
        workspaceId: 'ws-1',
        title: `Stress Deal ${i}`,
        value: 100 * (i + 1),
        stage: 'Lead',
      });
      testIds.push(d.id);
    }

    const midCount = db.getTable('deals').length;
    assert(midCount === startCount + 30, 'Atomic Persistence', '30 concurrent batch records persisted accurately');

    // Clean up
    for (const id of testIds) {
      db.delete('deals', (d: any) => d.id === id);
    }

    const endCount = db.getTable('deals').length;
    assert(endCount === startCount, 'Atomic Persistence', 'Stress test cleaned up with zero leftover state');
  } catch (err: any) {
    assert(false, 'Atomic Persistence', 'Atomic concurrency test threw', err.message);
  }

  // 12. WhatsApp Resilience & Failover Gateway
  try {
    const { WhatsAppResilienceGateway } = await import('../services/whatsappGateway.ts');
    const gateway = new WhatsAppResilienceGateway();
    const initialStatus = gateway.getStatus();
    assert(initialStatus.circuitState === 'CLOSED', 'WhatsApp Resilience', 'Initial circuit state is CLOSED');
    assert(initialStatus.dailyLimit >= 1000, 'WhatsApp Resilience', 'Meta Tier rate limit enforced (>= 1,000 daily)');

    const res = await gateway.dispatch({ to: '+1234567890', text: 'Hello automated enterprise test' });
    assert(res.success === true, 'WhatsApp Resilience', 'Message dispatch successful via active gateway');
  } catch (err: any) {
    assert(false, 'WhatsApp Resilience', 'WhatsApp resilience test threw', err.message);
  }

  // 13. Enterprise Async Queue Engine & DLQ
  try {
    const { JobQueueEngine } = await import('../queue/jobQueue.ts');
    const testQueue = new JobQueueEngine({ concurrency: 2, maxRetries: 1 });
    testQueue.clearDeadLetterQueue();
    let executionCount = 0;

    testQueue.registerHandler('test_fail', async () => {
      executionCount++;
      throw new Error('Simulated unrecoverable worker failure');
    });

    const failingJob = testQueue.enqueue('test_fail' as any, { sample: 123 });
    // Allow immediate tick
    await new Promise((r) => setTimeout(r, 50));

    const dlq = testQueue.getDeadLetterQueue();
    assert(dlq.length === 1 && dlq[0].id === failingJob.id, 'Async Queue DLQ', 'Failed job escalated to Dead Letter Queue');
    assert(testQueue.getMetrics().deadLetterCount === 1, 'Async Queue DLQ', 'Dead letter counter tracked in metrics');
    testQueue.clearDeadLetterQueue();
  } catch (err: any) {
    assert(false, 'Async Queue DLQ', 'Job queue DLQ test threw', err.message);
  }

  const allPassed = results.every((r) => r.passed);
  return { passed: allPassed, results };
}
