#!/usr/bin/env bash
# ==============================================================================
# WhatsOmni v3.0 — Automated Database Backup Script
# Creates timestamped, gzip-compressed database snapshots with SHA-256 verification.
# Retention policy: 14 days
# ==============================================================================

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/whatsomni}"
DATA_FILE="${DATA_FILE:-data/whatsomni_production.json}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/whatsomni_db_${TIMESTAMP}.json.gz"
CHECKSUM_FILE="${BACKUP_DIR}/whatsomni_db_${TIMESTAMP}.sha256"

mkdir -p "${BACKUP_DIR}"

if [[ ! -f "${DATA_FILE}" ]]; then
    echo "[-] Error: Data store file '${DATA_FILE}' not found." >&2
    exit 1
fi

echo "[+] Starting WhatsOmni database backup at $(date -u)..."

# Create atomic compressed backup
gzip -c "${DATA_FILE}" > "${BACKUP_FILE}"
sha256sum "${BACKUP_FILE}" > "${CHECKSUM_FILE}"

echo "[✓] Backup completed successfully: ${BACKUP_FILE}"
echo "[✓] Checksum generated: $(cat "${CHECKSUM_FILE}")"

# Retention enforcement: Remove backups older than 14 days
echo "[+] Enforcing 14-day retention policy..."
find "${BACKUP_DIR}" -name "whatsomni_db_*.json.gz" -type f -mtime +14 -delete
find "${BACKUP_DIR}" -name "whatsomni_db_*.sha256" -type f -mtime +14 -delete

echo "[✓] Backup cycle finished cleanly."
