# WhatsOmni v3.0 — Production Operations & SRE Incident Response Manual

This manual specifies Standard Operating Procedures (SOPs) for maintaining 99.95% uptime on the WhatsOmni v3.0 enterprise omnichannel platform.

---

## 1. Incident Response & Disaster Recovery Playbooks

### Incident 1: Database Loss / Corruption
- **Detection**: `/ready` endpoint returns HTTP 503 (`status: "degraded"`), or `data/whatsomni_production.json` read errors occur.
- **Immediate Action**: Stop application service via PM2: `pm2 stop whatsomni-server`.
- **Recovery**: Execute automated disaster recovery restore:
  ```bash
  bash /var/www/whatsomni/scripts/rollback.sh
  ```
  Or manually restore the latest verified snapshot:
  ```bash
  LATEST_BACKUP=$(ls -td /var/backups/whatsomni/whatsomni_db_*.json.gz | head -n 1)
  gunzip -c "$LATEST_BACKUP" > /var/www/whatsomni/data/whatsomni_production.json
  ```
- **Verification**: Run `curl -s http://127.0.0.1:3000/api/ready | jq .` and verify `status: "ready"` and `diskSync: true`.

---

### Incident 2: WhatsApp Cloud API & Webhook Ingestion Outage
- **Detection**: Inbound webhooks return errors or fail HMAC signature checks; alerts on `/api/operations/status` indicate missed delivery events.
- **Immediate Action**:
  1. Verify Meta Graph API status at `https://metastatus.com`.
  2. Inspect webhook signing secret: Ensure `WEBHOOK_SIGNING_SECRET` matches the secret configured in Meta App Dashboard > WhatsApp > Configuration.
  3. Verify Nginx SSL termination is passing raw request payloads intact without trimming `x-webhook-signature` or `stripe-signature`.
- **Verification**: Send a controlled test webhook using `scripts/smoke_test.ts` (Step 10) to verify `verified: true` and idempotent deduplication.

---

### Incident 3: Baileys Worker Socket Disconnection (Port 5001)
- **Detection**: Outbound messages stay in `PENDING_DELIVERY`; `/baileys/health` reports `activeSessions: 0`.
- **Immediate Action**:
  ```bash
  pm2 restart whatsomni-baileys
  # Or with systemd:
  systemctl restart whatsomni-baileys
  ```
- **Verification**: Check health endpoint: `curl -s http://127.0.0.1:5001/health | jq .` verifying `status: "healthy"`.

---

### Incident 4: AI Provider Latency / Outage (Gemini API)
- **Detection**: AI requests exceed 5,000ms latency or fail with HTTP 502/504; `/api/operations/status` flags `aiProvider: AMBER`.
- **Immediate Action**:
  1. The platform's built-in `AiOrchestrator` automatically falls back to deterministic rule-based smart replies and flow templates without throwing 500 errors to end users.
  2. If quota is exhausted, configure fallback BYOK key in Tenant Workspace Settings.
- **Verification**: Query `/api/ai/smart-reply` and confirm instant fallback generation.

---

### Incident 5: Disk Space Warning (> 85% Utilization)
- **Detection**: Server monitoring agent alerts on filesystem `/var/lib/whatsomni` or root mount.
- **Immediate Action**:
  ```bash
  # 1. Prune backups older than retention policy (14 days)
  find /var/backups/whatsomni -name "*.json.gz" -mtime +14 -delete
  # 2. Rotate and compress PM2 and Nginx logs
  pm2 flush
  logrotate -f /etc/logrotate.d/whatsomni
  ```
- **Verification**: Check disk availability: `df -h /`.

---

## 2. Log Rotation Configuration (`/etc/logrotate.d/whatsomni`)

```conf
/var/log/whatsomni/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 whatsomni whatsomni
    sharedscripts
    postrotate
        pm2 reloadLogs > /dev/null 2>&1 || true
    endscript
}
```

---

## 3. SSL Certificate Monitoring & Auto-Renewal

Let's Encrypt certificates expire every 90 days. Auto-renewal is configured via systemd timer or cron:
- Check expiration: `certbot certificates`
- Force test renewal: `certbot renew --dry-run`
- Post-renewal hook reloads Nginx automatically: `systemctl reload nginx`

---

## 4. Live Payment Gateway Activation Checklist

WhatsOmni v3.0 boots in **TEST_MODE_ACTIVE** by default to prevent accidental live billing charges. To activate LIVE billing:

1. Obtain Live API keys and Webhook Secrets from the gateway provider (Stripe, PayPal, Razorpay, etc.).
2. Set `PAYMENTS_LIVE_ENABLED=true` in `.env.production`.
3. In SuperAdmin > Billing > Gateways, toggle the gateway mode from `test` to `live` and paste the Live Public & Restricted Secret Keys.
4. Set the live Webhook Endpoint in the gateway dashboard to: `https://app.whatsomni.com/api/webhooks/<gateway_name>`.
5. Perform a $1.00 controlled live charge, verify successful subscription activation, and execute immediate test refund.
