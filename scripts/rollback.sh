#!/usr/bin/env bash
# ==============================================================================
# WhatsOmni v3.0 — Automated Emergency Rollback Script
# Reverts to previous known-good build artifact and latest verified database snapshot.
# ==============================================================================

set -euo pipefail

APP_DIR="/var/www/whatsomni"
RELEASES_DIR="/var/www/whatsomni_releases"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/whatsomni}"
DATA_FILE="${APP_DIR}/data/whatsomni_production.json"

echo "===================================================="
echo "WhatsOmni v3.0 Emergency Rollback Initiated"
echo "===================================================="

cd "${APP_DIR}"

# 1. Locate latest previous dist backup
LATEST_RELEASE=$(ls -td "${RELEASES_DIR}"/* 2>/dev/null | head -n 1 || true)

if [[ -n "${LATEST_RELEASE}" && -d "${LATEST_RELEASE}/dist_previous" ]]; then
    echo "[1] Restoring previous build artifact from ${LATEST_RELEASE}/dist_previous..."
    rm -rf "${APP_DIR}/dist"
    cp -r "${LATEST_RELEASE}/dist_previous" "${APP_DIR}/dist"
    echo "[✓] Previous application bundle restored."
else
    echo "[!] Warning: No previous dist archive found in ${RELEASES_DIR}."
fi

# 2. Check and restore latest database backup if needed
LATEST_BACKUP=$(ls -td "${BACKUP_DIR}"/whatsomni_db_*.json.gz 2>/dev/null | head -n 1 || true)
if [[ -n "${LATEST_BACKUP}" ]]; then
    echo "[2] Restoring database state from ${LATEST_BACKUP}..."
    gunzip -c "${LATEST_BACKUP}" > "${DATA_FILE}.restore_tmp"
    mv "${DATA_FILE}.restore_tmp" "${DATA_FILE}"
    echo "[✓] Database store restored to snapshot state."
fi

# 3. Restart application service
echo "[3] Restarting application processes..."
if command -v pm2 &> /dev/null; then
    pm2 restart ecosystem.config.cjs --env production
elif command -v systemctl &> /dev/null; then
    systemctl restart whatsomni
    systemctl restart whatsomni-baileys
fi

# 4. Verify recovery
echo "[4] Verifying health after rollback..."
sleep 2
if curl -sf http://127.0.0.1:3000/api/health > /dev/null; then
    echo "===================================================="
    echo "ROLLBACK SUCCESSFUL: Application restored to healthy state."
    echo "===================================================="
else
    echo "===================================================="
    echo "[-] Warning: Health check still failing. Review system logs immediately." >&2
    echo "===================================================="
    exit 1
fi
