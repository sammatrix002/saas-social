#!/usr/bin/env bash
# ==============================================================================
# WhatsOmni v3.0 — Automated TLS / Let's Encrypt SSL Provisioning & Renewal
# Production Domains: app.whatsomni.com, api.whatsomni.com
# ==============================================================================

set -euo pipefail

PRIMARY_DOMAIN="${PRIMARY_DOMAIN:-app.whatsomni.com}"
API_DOMAIN="${API_DOMAIN:-api.whatsomni.com}"
ADMIN_EMAIL="${ADMIN_EMAIL:-ops@whatsomni.com}"

echo "[+] Initializing Let's Encrypt TLS Certificate setup for ${PRIMARY_DOMAIN}..."

# Ensure certbot is installed
if ! command -v certbot &> /dev/null; then
    echo "[+] Installing certbot and python3-certbot-nginx..."
    apt-get update -y && apt-get install -y certbot python3-certbot-nginx
fi

# Create ACME challenge directory
mkdir -p /var/www/certbot

# Request production multi-domain certificate
echo "[+] Requesting certificate from Let's Encrypt..."
certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "${ADMIN_EMAIL}" \
    --agree-tos \
    --no-eff-email \
    --keep-until-expiring \
    -d "${PRIMARY_DOMAIN}" \
    -d "${API_DOMAIN}"

# Set up automated renewal cron job (runs twice daily at 03:00 and 15:00)
CRON_JOB="0 3,15 * * * certbot renew --quiet --post-hook 'systemctl reload nginx' > /dev/null 2>&1"
(crontab -l 2>/dev/null | grep -Fv "certbot renew" ; echo "$CRON_JOB") | crontab -

echo "[✓] Automated SSL certificate provisioned and auto-renewal cron configured."
