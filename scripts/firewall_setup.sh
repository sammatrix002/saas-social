#!/usr/bin/env bash
# ==============================================================================
# WhatsOmni v3.0 — Production Linux VPS Firewall Policy (UFW)
# Strict least-privilege exposure: Exposes only SSH (22), HTTP (80), HTTPS (443).
# Denies direct access to internal Node.js (3000), Baileys (5001), and databases.
# ==============================================================================

set -euo pipefail

echo "[+] Configuring UFW Firewall for WhatsOmni Enterprise VPS..."

# Reset to defaults
ufw --force reset

# Default policies: Deny all incoming, allow all outgoing
ufw default deny incoming
ufw default allow outgoing

# Allow standard SSH (recommend changing to custom port if configured)
SSH_PORT="${SSH_PORT:-22}"
echo "[+] Allowing SSH on port ${SSH_PORT}/tcp with rate limiting..."
ufw limit "${SSH_PORT}/tcp" comment "SSH rate-limited"

# Allow public Web Traffic
echo "[+] Allowing HTTP (80/tcp) and HTTPS (443/tcp)..."
ufw allow 80/tcp comment "HTTP for Let's Encrypt validation & redirect"
ufw allow 443/tcp comment "HTTPS Production Traffic"

# Explicitly ensure internal ports are blocked from external interfaces
ufw deny 3000/tcp comment "Block direct Express port access"
ufw deny 5001/tcp comment "Block direct Baileys port access"
ufw deny 3306/tcp comment "Block MySQL/MariaDB"
ufw deny 5432/tcp comment "Block PostgreSQL"
ufw deny 6379/tcp comment "Block Redis"

# Enable UFW
echo "[+] Enabling UFW..."
ufw --force enable

echo "[✓] UFW Firewall successfully configured."
ufw status verbose
