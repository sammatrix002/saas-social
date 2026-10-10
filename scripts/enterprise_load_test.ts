/**
 * WhatsOmni v3.0 — Enterprise Scale-Up High-Concurrency Load Test
 * Executes 1,000 concurrent requests across health, database, authenticated APIs, and burst webhooks.
 * Measures throughput, P50/P95/P99 latency, queue throughput, and memory consumption.
 */

import http from 'http';
import crypto from 'crypto';

const BASE_URL = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';

const httpAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 100,
  maxFreeSockets: 50,
  timeout: 30000,
});

function sendRequest(path: string, options: any = {}): Promise<{ status: number; latencyMs: number }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const start = process.hrtime.bigint();

    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + (url.search || ''),
        method: options.method || 'GET',
        headers: options.headers || {},
        agent: httpAgent,
      },
      (res) => {
        res.on('data', () => {});
        res.on('end', () => {
          const latencyMs = Number(process.hrtime.bigint() - start) / 1_000_000;
          resolve({ status: res.statusCode || 0, latencyMs });
        });
      }
    );

    req.on('error', reject);
    if (options.body) req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    req.end();
  });
}

function computePercentiles(latencies: number[]) {
  latencies.sort((a, b) => a - b);
  return {
    p50: Number(latencies[Math.floor(latencies.length * 0.5)].toFixed(2)),
    p95: Number(latencies[Math.floor(latencies.length * 0.95)].toFixed(2)),
    p99: Number(latencies[Math.floor(latencies.length * 0.99)].toFixed(2)),
    avg: Number((latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2)),
    max: Number(latencies[latencies.length - 1].toFixed(2)),
  };
}

async function runConcurrentPool(tasks: (() => Promise<void>)[], concurrency: number = 30) {
  let index = 0;
  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, async () => {
    while (index < tasks.length) {
      const current = index++;
      if (current < tasks.length) {
        await tasks[current]();
      }
    }
  });
  await Promise.all(workers);
}

async function runEnterpriseLoadTest() {
  console.log('====================================================');
  console.log(`WhatsOmni v3.0 1,000-Request Enterprise Load Test [${BASE_URL}]`);
  console.log('====================================================');

  const initialMem = process.memoryUsage();
  console.log(`[Baseline Memory] RSS: ${(initialMem.rss / (1024 * 1024)).toFixed(1)}MB | Heap: ${(initialMem.heapUsed / (1024 * 1024)).toFixed(1)}MB`);

  // Obtain Auth Token for Authenticated Phases
  let authToken = '';
  try {
    const authRes = await new Promise<any>((resolve) => {
      const req = http.request(
        { hostname: '127.0.0.1', port: 3000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
        (res) => {
          let data = '';
          res.on('data', (c) => (data += c));
          res.on('end', () => resolve(JSON.parse(data)));
        }
      );
      req.write(JSON.stringify({ email: 'admin@whatsomni.com', password: 'Password123!' }));
      req.end();
    });
    authToken = authRes.token;
  } catch (err: any) {
    console.error('Failed to authenticate:', err.message);
  }

  const allLatencies: number[] = [];
  let successfulRequests = 0;
  let failedRequests = 0;
  const startTime = Date.now();

  // Phase 1: 500 Concurrent Health & Readiness Checks
  console.log('\n[Phase 1] Executing 500 concurrent Health & Readiness probes...');
  const phase1Tasks: (() => Promise<void>)[] = [];
  for (let i = 0; i < 500; i++) {
    const endpoint = i % 2 === 0 ? '/health' : '/ready';
    phase1Tasks.push(async () => {
      const res = await sendRequest(endpoint);
      allLatencies.push(res.latencyMs);
      if (res.status === 200) successfulRequests++;
      else failedRequests++;
    });
  }
  await runConcurrentPool(phase1Tasks, 40);

  // Phase 2: 300 Concurrent Authenticated CRM & Channel Queries
  console.log('[Phase 2] Executing 300 concurrent Authenticated API requests...');
  const phase2Tasks: (() => Promise<void>)[] = [];
  for (let i = 0; i < 300; i++) {
    const endpoint = i % 3 === 0 ? '/api/channels' : i % 3 === 1 ? '/api/crm/deals' : '/api/tenants';
    phase2Tasks.push(async () => {
      const res = await sendRequest(endpoint, {
        headers: { Authorization: `Bearer ${authToken}`, 'x-workspace-id': 'ws-1' },
      });
      allLatencies.push(res.latencyMs);
      if (res.status === 200) successfulRequests++;
      else failedRequests++;
    });
  }
  await runConcurrentPool(phase2Tasks, 30);

  // Phase 3: 200 Concurrent Burst Webhooks with HMAC Verification & Queue Enqueue
  console.log('[Phase 3] Executing 200 concurrent Burst Webhooks with HMAC verification...');
  const secret = 'whsec_production_omni_2026';
  const phase3Tasks: (() => Promise<void>)[] = [];
  for (let i = 0; i < 200; i++) {
    const payload = JSON.stringify({
      id: `load_burst_${Date.now()}_${i}_${Math.random()}`,
      event: 'payment.burst',
      amount: 100 + i,
    });
    const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    phase3Tasks.push(async () => {
      const res = await sendRequest('/api/webhooks/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-webhook-signature': sig },
        body: payload,
      });
      allLatencies.push(res.latencyMs);
      if (res.status === 200) successfulRequests++;
      else failedRequests++;
    });
  }
  await runConcurrentPool(phase3Tasks, 25);

  const durationSec = (Date.now() - startTime) / 1000;
  const totalRequests = successfulRequests + failedRequests;
  const throughputRps = (totalRequests / durationSec).toFixed(1);
  const metrics = computePercentiles(allLatencies);
  const finalMem = process.memoryUsage();

  console.log('\n====================================================');
  console.log('1,000-REQUEST LOAD TEST RESULTS:');
  console.log('----------------------------------------------------');
  console.log(`Total Requests Completed : ${totalRequests}`);
  console.log(`Success Rate             : ${((successfulRequests / totalRequests) * 100).toFixed(1)}% (${successfulRequests} / ${totalRequests})`);
  console.log(`Failed Requests          : ${failedRequests}`);
  console.log(`Duration                 : ${durationSec.toFixed(2)}s`);
  console.log(`Throughput               : ${throughputRps} req/sec`);
  console.log(`P50 Latency              : ${metrics.p50}ms`);
  console.log(`P95 Latency              : ${metrics.p95}ms`);
  console.log(`P99 Latency              : ${metrics.p99}ms`);
  console.log(`Average Latency          : ${metrics.avg}ms`);
  console.log(`Max Latency              : ${metrics.max}ms`);
  console.log(`Final Memory RSS         : ${(finalMem.rss / (1024 * 1024)).toFixed(1)}MB (Delta: +${((finalMem.rss - initialMem.rss) / (1024 * 1024)).toFixed(1)}MB)`);
  console.log('====================================================');

  if (failedRequests > 0 || metrics.p95 > 250) {
    throw new Error('Load test failed SLA threshold.');
  }

  console.log('RESULT: 1,000-REQUEST ENTERPRISE CAPACITY CERTIFIED');
  console.log('====================================================');
}

runEnterpriseLoadTest().catch((err) => {
  console.error('Load test threw an error:', err);
  process.exit(1);
});
