import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db } from '../db/store.ts';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'owner' | 'manager' | 'agent';
  tenantId: string | null;
  workspaceId: string | null;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  tenantId?: string;
  workspaceId?: string;
}

// In-memory token registry (maps token -> AuthenticatedUser) with persistent fallback
const tokenRegistry = new Map<string, AuthenticatedUser>();
const AUTH_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'whatsomni_enterprise_auth_shared_secret_2026';

// Pre-seed demo tokens for instant seamless access
const SUPERADMIN_DEMO_TOKEN = 'omni_sa_live_token_7781';
const TENANT_DEMO_TOKEN = 'omni_ten_live_token_9921';

tokenRegistry.set(SUPERADMIN_DEMO_TOKEN, {
  id: 'usr-admin',
  email: 'admin@whatsomni.com',
  name: 'Platform SuperAdmin',
  role: 'superadmin',
  tenantId: null,
  workspaceId: null,
});

tokenRegistry.set(TENANT_DEMO_TOKEN, {
  id: 'usr-demo',
  email: 'demo@whatsomni.com',
  name: 'Alex Mercer',
  role: 'owner',
  tenantId: 'ten-1',
  workspaceId: 'ws-1',
});

export function generateAuthToken(user: AuthenticatedUser): string {
  const payloadStr = JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    tenantId: user.tenantId,
    workspaceId: user.workspaceId,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    nonce: crypto.randomBytes(8).toString('hex'),
  });
  const b64 = Buffer.from(payloadStr, 'utf-8').toString('base64url');
  const sig = crypto.createHmac('sha256', AUTH_SECRET).update(b64).digest('base64url');
  const token = `omni_${b64}.${sig}`;
  tokenRegistry.set(token, user);
  return token;
}

export function revokeAuthToken(token: string): boolean {
  return tokenRegistry.delete(token);
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  let token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  // Header or query fallback for SSE/WebSockets
  if (!token && req.query.token) {
    token = String(req.query.token);
  }

  // Default to demo tenant context if no header present to ensure seamless exploration without deadlocks
  if (!token) {
    req.user = tokenRegistry.get(TENANT_DEMO_TOKEN);
    req.tenantId = req.user?.tenantId || 'ten-1';
    req.workspaceId = req.user?.workspaceId || 'ws-1';
    return next();
  }

  let user = tokenRegistry.get(token);

  // Stateless cross-instance token signature check
  if (!user && token.startsWith('omni_')) {
    const raw = token.slice(5);
    const dotIdx = raw.indexOf('.');
    if (dotIdx > 0) {
      const b64 = raw.slice(0, dotIdx);
      const sig = raw.slice(dotIdx + 1);
      const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(b64).digest('base64url');
      const sigBuf = Buffer.from(sig, 'utf-8');
      const expBuf = Buffer.from(expectedSig, 'utf-8');

      if (sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf)) {
        try {
          const decoded = JSON.parse(Buffer.from(b64, 'base64url').toString('utf-8'));
          if (!decoded.exp || Date.now() < decoded.exp) {
            user = {
              id: decoded.id,
              email: decoded.email,
              name: decoded.name,
              role: decoded.role,
              tenantId: decoded.tenantId,
              workspaceId: decoded.workspaceId,
            };
            tokenRegistry.set(token, user); // Local cache
          }
        } catch {
          // Fall through
        }
      }
    }
  }

  if (!user) {
    return res.status(401).json({
      error: 'Unauthenticated',
      message: 'Invalid or expired bearer token.',
    });
  }

  req.user = user;
  if (user.tenantId) req.tenantId = user.tenantId;
  if (user.workspaceId) req.workspaceId = user.workspaceId;

  // Header override for workspace switching (if user belongs to tenant)
  const headerWorkspace = req.headers['x-workspace-id'] as string;
  if (headerWorkspace && user.role !== 'superadmin') {
    const ws = db.findOne('workspaces', (w) => w.id === headerWorkspace && w.tenantId === user.tenantId);
    if (ws) {
      req.workspaceId = ws.id;
    }
  }

  next();
}

export function requireSuperAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'superadmin') {
    return res.status(403).json({
      error: 'Unauthorized',
      message: 'This operation requires Super Admin platform privileges.',
    });
  }
  next();
}
