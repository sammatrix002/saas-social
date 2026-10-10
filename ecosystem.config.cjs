/**
 * WhatsOmni v3.0 — PM2 Enterprise Production Process Configuration
 * Orchestrates main Express API server and Baileys WhatsApp worker.
 */

module.exports = {
  apps: [
    {
      name: 'whatsomni-server',
      script: './dist/server.js',
      instances: 1, // Single-instance or cluster with sticky sessions
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1024M',
      kill_timeout: 6000, // 6 seconds for graceful SIGTERM/SIGINT atomic flush
      wait_ready: true,
      listen_timeout: 10000,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 2000,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/whatsomni/server-error.log',
      out_file: '/var/log/whatsomni/server-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
    {
      name: 'whatsomni-baileys',
      script: './services/baileys-worker/server.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      kill_timeout: 5000,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
      env: {
        NODE_ENV: 'production',
        BAILEYS_PORT: 5001,
      },
      error_file: '/var/log/whatsomni/baileys-error.log',
      out_file: '/var/log/whatsomni/baileys-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
