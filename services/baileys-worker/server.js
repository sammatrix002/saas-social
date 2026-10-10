import express from 'express';
import pino from 'pino';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.BAILEYS_PORT ? parseInt(process.env.BAILEYS_PORT, 10) : 5001;
const BAILEYS_SECRET = process.env.BAILEYS_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'dev_baileys_secret_placeholder');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

app.use(express.json());

// Administrative Endpoint Security via X-Baileys-Secret
app.use((req, res, next) => {
  if (req.path === '/health') return next();
  const secret = req.headers['x-baileys-secret'];
  if (!secret || secret !== BAILEYS_SECRET) {
    logger.warn({ ip: req.ip, path: req.path }, 'Unauthorized Baileys administrative call attempt');
    return res.status(403).json({ error: 'Forbidden: Invalid X-Baileys-Secret token' });
  }
  next();
});

// Active in-memory session registry (persisted in SQLite or Redis in production)
const sessions = new Map();

// 1. Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    microservice: 'WhatsOmni Baileys Multi-Device Worker',
    version: '3.0.0',
    activeSessions: sessions.size,
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

// 2. Start / Initialize QR pairing session
app.post('/api/sessions/:sessionId/init', (req, res) => {
  const { sessionId } = req.params;
  const { tenantId, workspaceId } = req.body;

  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      id: sessionId,
      tenantId,
      workspaceId,
      status: 'SCAN_QR_CODE',
      qrCode: `2@${Date.now()}_whatsomni_baileys_pair_qr_matrix`,
      connectedAt: null,
      lastActive: new Date().toISOString(),
    });
    logger.info({ sessionId, tenantId }, 'New Baileys Multi-Device socket session initialized');
  }

  const session = sessions.get(sessionId);
  res.json({
    sessionId,
    status: session.status,
    qrCode: session.qrCode,
    pairingCode: '7421-9843',
  });
});

// 3. Get session status & QR
app.get('/api/sessions/:sessionId/status', (req, res) => {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(session);
});

// 4. Send outbound message through Baileys socket
app.post('/api/sessions/:sessionId/messages/send', async (req, res) => {
  const { sessionId } = req.params;
  const { to, text, type } = req.body;

  const session = sessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Active Baileys session not found' });
  }

  // Simulate non-blocking socket dispatch
  const messageId = `3EB0${Date.now().toString(16).toUpperCase()}`;
  logger.info({ sessionId, to, messageId }, 'Outbound Baileys message queued for socket dispatch');

  res.json({
    success: true,
    messageId,
    status: 'PENDING_DELIVERY',
    timestamp: new Date().toISOString(),
  });
});

// 5. Terminate / Disconnect session
app.delete('/api/sessions/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  if (sessions.has(sessionId)) {
    sessions.delete(sessionId);
    logger.info({ sessionId }, 'Baileys session gracefully terminated and cleaned');
  }
  res.json({ success: true, message: 'Session disconnected' });
});

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`WhatsOmni Baileys Worker Microservice listening on Port ${PORT}`);
});
