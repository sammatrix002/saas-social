#!/usr/bin/env bash
# ==============================================================================
# WhatsOmni v3.0 — Enterprise Production Zero-Downtime Deployment Script
# Steps:
# 1. Pre-deployment state snapshot & database backup
# 2. Dependency installation
# 3. TypeScript compilation & production bundle generation
# 4. Artifact integrity verification
# 5. Graceful process reload (PM2 / systemd)
# 6. Post-deployment health & readiness verification
# 7. Automatic rollback trigger upon failure
# ==============================================================================

set -euo pipefail

APP_DIR="/var/www/whatsomni"
BACKUP_SCRIPT="${APP_DIR}/scripts/backup.sh"
ROLLBACK_SCRIPT="${APP_DIR}/scripts/rollback.sh"
RELEASE_TAG=$(date +"%Y%m%d_%H%M%S")
RELEASES_DIR="/var/www/whatsomni_releases"

echo "===================================================="
echo "WhatsOmni v3.0 Production Release [Tag: ${RELEASE_TAG}]"
echo "===================================================="

cd "${APP_DIR}"

# Step 1: Pre-deployment backup
echo "[1/6] Generating pre-deployment database backup..."
if [[ -x "${BACKUP_SCRIPT}" ]]; then
    "${BACKUP_SCRIPT}"
else
    bash "${BACKUP_SCRIPT}"
fi

# Step 2: Backup current dist for instant rollback
mkdir -p "${RELEASES_DIR}/${RELEASE_TAG}"
if [[ -d "${APP_DIR}/dist" ]]; then
    echo "[2/6] Archiving current production dist artifact..."
    cp -r "${APP_DIR}/dist" "${RELEASES_DIR}/${RELEASE_TAG}/dist_previous"
fi

# Step 3: Clean installation & build
echo "[3/6] Installing production dependencies and building assets..."
npm install --frozen-lockfile || npm install
npm run build

# Step 4: Verify built artifacts
echo "[4/6] Verifying release bundle integrity..."
if [[ ! -f "${APP_DIR}/dist/index.html" ]]; then
    echo "[-] Error: dist/index.html missing after build." >&2
    exit 1
fi
if [[ ! -f "${APP_DIR}/dist/server.js" ]]; then
    echo "[-] Error: dist/server.js missing after build." >&2
    exit 1
fi
echo "[✓] Frontend and Server artifacts confirmed."

# Step 5: Graceful process reload
echo "[5/6] Executing graceful process reload..."
if command -v pm2 &> /dev/null; then
    pm2 reload ecosystem.config.cjs --env production --update-env
elif command -v systemctl &> /dev/null; then
    systemctl reload-or-restart whatsomni
    systemctl reload-or-restart whatsomni-baileys
else
    echo "[!] Neither PM2 nor systemd detected, skipping service reload."
fi

# Step 6: Health & Readiness check verification
echo "[6/6] Polling production health endpoints..."
MAX_ATTEMPTS=15
HEALTHY=false

for i in $(seq 1 $MAX_ATTEMPTS); do
    if curl -sf http://127.0.0.1:3000/api/health > /dev/null && curl -sf http://127.0.0.1:3000/api/ready > /dev/null; then
        HEALTHY=true
        break
    fi
    echo "    Waiting for application readiness (attempt $i/$MAX_ATTEMPTS)..."
    sleep 1
done

if [[ "$HEALTHY" == "true" ]]; then
    echo "===================================================="
    echo "SUCCESS: WhatsOmni v3.0 deployed and verified healthy."
    echo "===================================================="
else
    echo "===================================================="
    echo "[-] CRITICAL: Deployment health verification failed!" >&2
    echo "[-] Triggering automated rollback..." >&2
    bash "${ROLLBACK_SCRIPT}"
    exit 1
fi
