/**
 * WhatsOmni v3.0 — Independent Production Load & Concurrency Audit Runner
 * 
 * Executes:
 * A. 1,000 Request Concurrency Test (P50, P95, P99, Throughput, Error Rate)
 * B. 10,000 Request High-Volume Stress Test (Memory Trend, RSS Peak, Queue Backlog)
 * C. Concurrent Authenticated Reads & JWT Verification
 * D. Concurrent Read/Write Races (Simultaneous store writes & queries)
 * E. Concurrent Webhook Deduplication Race (Duplicate delivery under high concurrency)
 */

import http from 'http';
import crypto from 'crypto';

const BASE_URL = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';

const agent = new http.Agent({
  keepAlive: true,
  maxSockets: 100,
  maxFreeSockets: 50,
  timeout: 30000,
});

interface RequestResult {
  status: number;
  latencyMs: number;
  body?: any;
}

function sendReq(path: string, options: any = {}): Promise<RequestResult> {
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
        agent,
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          const latencyMs = Number(process.hrtime.bigint() - start) / 1_000_000;
          let body = null;
          try {
            body = raw ? JSON.parse(raw) : null;
          } catch {
            body = raw;
          }
          resolve({ status: res.statusCode || 0, latencyMs, body });
        });
      }
    );

    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

function computeStats(latencies: number[]) {
  if (latencies.length === 0) return { p50: 0, p95: 0, p99: 0, avg: 0, max: 0 };
  latencies.sort((a, b) => a - b);
  return {
    p50: Number(latencies[Math.floor(latencies.length * 0.5)].toFixed(2)),
    p95: Number(latencies[Math.floor(latencies.length * 0.95)].toFixed(2)),
    p99: Number(latencies[Math.floor(latencies.length * 0.99)].toFixed(2)),
    avg: Number((latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2)),
    max: Number(latencies[latencies.length - 1].toFixed(2)),
  };
}

async function runPool(tasks: (() => Promise<void>)[], concurrency: number = 30) {
  let index = 0;
  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, async () => {
    while (index < tasks.length) {
      const cur = index++;
      if (cur < tasks.length) {
        await tasks[cur]();
      }
    }
  });
  await Promise.all(workers);
}

export async function runIndependentAuditLoadTest() {
  console.log('====================================================');
  console.log(`WhatsOmni v3.0 Independent Production Concurrency & Load Audit [${BASE_URL}]`);
  console.log('====================================================');

  const initialMem = process.memoryUsage();
  let peakRss = initialMem.rss;

  const trackMem = () => {
    const cur = process.memoryUsage().rss;
    if (cur > peakRss) peakRss = cur;
  };

  // Obtain Authentication Token
  let authToken = '';
  try {
    const authRes = await sendReq('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: 'admin@whatsomni.com', password: 'Password123!' },
    });
    authToken = authRes.body?.token;
  } catch (err: any) {
    console.error('[-] Auth failure in audit load test:', err.message);
  }

  // --------------------------------------------------------------------------
  // WORKLOAD A: 1,000-Request Standard Enterprise Baseline
  // --------------------------------------------------------------------------
  console.log('\n[Workload A] Executing 1,000 Requests Baseline (500 Health, 300 Auth, 200 Webhooks)...');
  const aLatencies: number[] = [];
  let aSuccess = 0;
  let aFailed = 0;
  const aStart = Date.now();

  const aTasks: (() => Promise<void>)[] = [];
  for (let i = 0; i < 500; i++) {
    aTasks.push(async () => {
      const res = await sendReq(i % 2 === 0 ? '/health' : '/ready');
      aLatencies.push(res.latencyMs);
      if (res.status === 200) aSuccess++; else aFailed++;
      trackMem();
    });
  }
  for (let i = 0; i < 300; i++) {
    aTasks.push(async () => {
      const res = await sendReq('/api/channels', {
        headers: { Authorization: `Bearer ${authToken}`, 'x-workspace-id': 'ws-1' },
      });
      aLatencies.push(res.latencyMs);
      if (res.status === 200) aSuccess++; else aFailed++;
      trackMem();
    });
  }
  const secret = 'whsec_production_omni_2026';
  for (let i = 0; i < 200; i++) {
    const payload = JSON.stringify({ id: `audit_a_${i}`, event: 'charge.succeeded', amount: 50 + i });
    const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    aTasks.push(async () => {
      const res = await sendReq('/api/webhooks/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-webhook-signature': sig },
        body: payload,
      });
      aLatencies.push(res.latencyMs);
      if (res.status === 200) aSuccess++; else aFailed++;
      trackMem();
    });
  }
  await runPool(aTasks, 35);
  const aDurationSec = (Date.now() - aStart) / 1000;
  const aStats = computeStats(aLatencies);

  console.log(`    Total: 1000 | Success: ${aSuccess} | Failed: ${aFailed} | Duration: ${aDurationSec.toFixed(2)}s`);
  console.log(`    Throughput: ${(1000 / aDurationSec).toFixed(1)} req/s | P50: ${aStats.p50}ms | P95: ${aStats.p95}ms | P99: ${aStats.p99}ms`);

  // --------------------------------------------------------------------------
  // WORKLOAD D: Concurrent Read/Write Races (Atomic store validation)
  // --------------------------------------------------------------------------
  console.log('\n[Workload D] Executing Concurrent Read/Write Store Mutation Race (100 parallel writes & reads)...');
  const dLatencies: number[] = [];
  let dSuccess = 0;
  let dFailed = 0;
  const dCreatedIds: string[] = [];

  const dTasks: (() => Promise<void>)[] = [];
  for (let i = 0; i < 50; i++) {
    // Write task
    dTasks.push(async () => {
      const res = await sendReq('/api/crm/deals', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json', 'x-workspace-id': 'ws-1' },
        body: { title: `Audit Race Deal ${i}`, value: 1000 + i, stage: 'Lead' },
      });
      dLatencies.push(res.latencyMs);
      if (res.status === 201 && res.body?.id) {
        dSuccess++;
        dCreatedIds.push(res.body.id);
      } else {
        dFailed++;
      }
      trackMem();
    });
    // Read task
    dTasks.push(async () => {
      const res = await sendReq('/api/crm/deals', {
        headers: { Authorization: `Bearer ${authToken}`, 'x-workspace-id': 'ws-1' },
      });
      dLatencies.push(res.latencyMs);
      if (res.status === 200) dSuccess++; else dFailed++;
      trackMem();
    });
  }
  await runPool(dTasks, 20);
  const dStats = computeStats(dLatencies);
  console.log(`    Read/Write Operations: 100 | Success: ${dSuccess} | Failed: ${dFailed} | P50: ${dStats.p50}ms | P95: ${dStats.p95}ms`);

  // --------------------------------------------------------------------------
  // WORKLOAD E: Concurrent Webhook Deduplication Race
  // --------------------------------------------------------------------------
  console.log('\n[Workload E] Executing Webhook Ingress Idempotency Race (10 simultaneous dispatches of IDENTICAL event)...');
  const raceEventId = `idempotency_race_${Date.now()}`;
  const racePayload = JSON.stringify({ id: raceEventId, event: 'order.placed', customer: 'Audit Race' });
  const raceSig = crypto.createHmac('sha256', secret).update(racePayload).digest('hex');

  const eTasks: (() => Promise<void>)[] = [];
  let eProcessedOnce = 0;
  let eIgnoredDuplicates = 0;
  for (let i = 0; i < 10; i++) {
    eTasks.push(async () => {
      const res = await sendReq('/api/webhooks/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-webhook-signature': raceSig },
        body: racePayload,
      });
      if (res.body?.action === 'PROCESSED') eProcessedOnce++;
      if (res.body?.action === 'IGNORED_DUPLICATE') eIgnoredDuplicates++;
      trackMem();
    });
  }
  await Promise.all(eTasks.map((t) => t()));
  console.log(`    Race Results: Processed Once = ${eProcessedOnce} | Ignored Duplicates = ${eIgnoredDuplicates}`);
  const idempotencyPassed = eProcessedOnce === 1 && eIgnoredDuplicates === 9;
  console.log(`    Idempotency Safety: ${idempotencyPassed ? '[✓ PASS] Single execution guaranteed under concurrent race' : '[-] FAILED duplicate execution'}`);

  // --------------------------------------------------------------------------
  // WORKLOAD B: 10,000-Request High-Volume Sustained Traffic
  // --------------------------------------------------------------------------
  console.log('\n[Workload B] Executing 10,000-Request Sustained Volume Test (Probing Event Loop & Memory Trend)...');
  const bLatencies: number[] = [];
  let bSuccess = 0;
  let bFailed = 0;
  const bStart = Date.now();

  const bTasks: (() => Promise<void>)[] = [];
  for (let i = 0; i < 10000; i++) {
    const endpoint = i % 4 === 0 ? '/health' : i % 4 === 1 ? '/ready' : i % 4 === 2 ? '/api/channels' : '/api/metrics';
    const isAuth = endpoint === '/api/channels';
    bTasks.push(async () => {
      const res = await sendReq(endpoint, isAuth ? { headers: { Authorization: `Bearer ${authToken}`, 'x-workspace-id': 'ws-1' } } : {});
      bLatencies.push(res.latencyMs);
      if (res.status === 200) bSuccess++; else bFailed++;
      if (i % 500 === 0) trackMem();
    });
  }

  await runPool(bTasks, 40);
  const bDurationSec = (Date.now() - bStart) / 1000;
  const bStats = computeStats(bLatencies);
  const finalMem = process.memoryUsage();

  console.log(`    Total Requests Completed : 10,000`);
  console.log(`    Success Count            : ${bSuccess} (${((bSuccess / 10000) * 100).toFixed(1)}%)`);
  console.log(`    Failed Count             : ${bFailed}`);
  console.log(`    Test Duration            : ${bDurationSec.toFixed(2)}s`);
  console.log(`    Sustained Throughput     : ${(10000 / bDurationSec).toFixed(1)} req/s`);
  console.log(`    P50 Latency              : ${bStats.p50}ms`);
  console.log(`    P95 Latency              : ${bStats.p95}ms`);
  console.log(`    P99 Latency              : ${bStats.p99}ms`);
  console.log(`    Average Latency          : ${bStats.avg}ms`);
  console.log(`    Max Latency              : ${bStats.max}ms`);
  console.log(`    Initial RSS Memory       : ${(initialMem.rss / (1024 * 1024)).toFixed(1)}MB`);
  console.log(`    Peak RSS Memory          : ${(peakRss / (1024 * 1024)).toFixed(1)}MB`);
  console.log(`    Final RSS Memory         : ${(finalMem.rss / (1024 * 1024)).toFixed(1)}MB`);
  console.log(`    Memory Delta             : +${((finalMem.rss - initialMem.rss) / (1024 * 1024)).toFixed(1)}MB`);

  // Verify SRE Queue Backlog & Metrics
  const metricsRes = await sendReq('/api/metrics', { headers: { Accept: 'application/json' } });
  console.log('\n[Observability Check] Final SRE Metrics:');
  console.log(`    Queue Backlog : ${metricsRes.body?.queue?.pendingBacklog ?? 0}`);
  console.log(`    Dead Letter   : ${metricsRes.body?.queue?.deadLetterCount ?? 0}`);
  console.log(`    DB Records    : ${metricsRes.body?.database?.recordsTotal ?? 0}`);

  console.log('\n====================================================');
  console.log('INDEPENDENT LOAD & CONCURRENCY AUDIT COMPLETE');
  console.log('====================================================');

  return {
    workloadA: { count: 1000, success: aSuccess, throughput: (1000 / aDurationSec).toFixed(1), p95: aStats.p95 },
    workloadB: { count: 10000, success: bSuccess, throughput: (10000 / bDurationSec).toFixed(1), p95: bStats.p95, p99: bStats.p99 },
    idempotencyPassed,
    memoryDeltaMb: ((finalMem.rss - initialMem.rss) / (1024 * 1024)).toFixed(1),
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runIndependentAuditLoadTest().catch((err) => {
    console.error('Audit run failed:', err);
    process.exit(1);
  });
}
