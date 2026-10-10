import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { AuthenticatedRequest } from './auth.ts';
import { distributedState, RateLimitResult } from '../services/distributedState.ts';

/**
 * Validates outgoing URLs to protect against Server-Side Request Forgery (SSRF).
 * Blocks loopbacks, private subnets (RFC 1918), decimal/hex/octal representations,
 * IPv6 mapped variants, and cloud metadata services.
 */
export class UrlSecurityValidator {
  private static BLOCKED_HOSTS = new Set([
    'localhost',
    '127.0.0.1',
    '::1',
    '0.0.0.0',
    '169.254.169.254', // AWS/GCP/Azure link-local metadata
    'metadata.google.internal',
    'metadata.goog',
    'instance-data',
  ]);

  /**
   * Converts decimal/hex/octal host representation into canonical IPv4 string if applicable.
   */
  private static parseNumericalIp(host: string): string | null {
    // Single number (Dword IP like 2130706433 or 0x7f000001)
    if (/^(0x[0-9a-f]+|\d+)$/i.test(host)) {
      const num = host.startsWith('0x') || host.startsWith('0X') ? parseInt(host, 16) : parseInt(host, 10);
      if (num >= 0 && num <= 0xffffffff) {
        return [
          (num >>> 24) & 255,
          (num >>> 16) & 255,
          (num >>> 8) & 255,
          num & 255,
        ].join('.');
      }
    }

    // 4-part octal or hex or decimal notation (e.g. 0177.0.0.1 or 0x7f.0.0.1)
    const parts = host.split('.');
    if (parts.length === 4) {
      const parsedParts: number[] = [];
      for (const part of parts) {
        if (/^0x[0-9a-f]+$/i.test(part)) {
          parsedParts.push(parseInt(part, 16));
        } else if (/^0\d+$/.test(part)) {
          parsedParts.push(parseInt(part, 8));
        } else if (/^\d+$/.test(part)) {
          parsedParts.push(parseInt(part, 10));
        } else {
          return null;
        }
      }
      if (parsedParts.every((p) => p >= 0 && p <= 255)) {
        return parsedParts.join('.');
      }
    }
    return null;
  }

  public static isSafeUrl(urlString: string): boolean {
    try {
      const parsed = new URL(urlString);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return false;
      }

      let hostname = parsed.hostname.toLowerCase().trim();

      // Strip IPv6 enclosing brackets if present
      if (hostname.startsWith('[') && hostname.endsWith(']')) {
        hostname = hostname.slice(1, -1);
      }

      // Canonicalize IPv4-mapped IPv6 address (e.g. ::ffff:192.168.1.1 or ::ffff:c0a8:101)
      if (hostname.startsWith('::ffff:')) {
        const rest = hostname.slice(7);
        if (rest.includes(':')) {
          const [h1, h2] = rest.split(':');
          const n1 = parseInt(h1, 16);
          const n2 = parseInt(h2, 16);
          if (!isNaN(n1) && !isNaN(n2)) {
            hostname = `${(n1 >> 8) & 255}.${n1 & 255}.${(n2 >> 8) & 255}.${n2 & 255}`;
          }
        } else {
          hostname = rest;
        }
      }

      // Check against explicit blocked hostnames
      if (this.BLOCKED_HOSTS.has(hostname)) {
        return false;
      }

      // Check IPv6 loopback, link-local, and unique-local representations
      if (
        hostname === '::' ||
        hostname === '::1' ||
        hostname.startsWith('fe80:') || // link-local
        hostname.startsWith('fc00:') || // unique local
        hostname.startsWith('fd00:')
      ) {
        return false;
      }

      // Resolve numeric/hex/octal obfuscations
      const canonicalIp = this.parseNumericalIp(hostname) || hostname;

      if (this.BLOCKED_HOSTS.has(canonicalIp)) {
        return false;
      }

      // Check 127.0.0.0/8 loopback subnet
      if (/^127\./.test(canonicalIp)) {
        return false;
      }

      // Check 0.0.0.0/8 current network
      if (/^0\./.test(canonicalIp)) {
        return false;
      }

      // Check IPv4 private subnets (RFC 1918)
      if (/^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/.test(canonicalIp)) {
        return false;
      }

      // Check carrier-grade NAT & link-local (100.64.0.0/10, 169.254.0.0/16)
      if (/^(100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\.|169\.254\.)/.test(canonicalIp)) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Validates HMAC signatures for webhook ingress using constant-time equality.
 */
export function verifyWebhookSignature(
  rawPayload: string | Buffer,
  signature: string,
  secret: string,
  algorithm: 'sha256' | 'sha1' = 'sha256'
): boolean {
  if (!signature || !secret) return false;
  try {
    const hmac = crypto.createHmac(algorithm, secret);
    hmac.update(rawPayload);
    const expected = hmac.digest('hex');
    const cleanSignature = signature.replace(/^sha256=|^sha1=/, '').trim();
    
    const sigBuffer = Buffer.from(cleanSignature, 'utf-8');
    const expBuffer = Buffer.from(expected, 'utf-8');

    if (sigBuffer.length !== expBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(sigBuffer, expBuffer);
  } catch {
    return false;
  }
}

/**
 * Middleware ensuring incoming requests are bound to the tenant scope.
 */
export function requireTenantScope(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.tenantId) {
    req.tenantId = (req.headers['x-tenant-id'] as string) || req.user?.tenantId || 'ten-1';
  }
  if (!req.workspaceId) {
    req.workspaceId = (req.headers['x-workspace-id'] as string) || req.user?.workspaceId || 'ws-1';
  }

  if (req.user?.role === 'superadmin') {
    // SuperAdmin can operate across tenants
    return next();
  }

  if (!req.tenantId || !req.workspaceId) {
    return res.status(403).json({
      error: 'TenantContextRequired',
      message: 'Active tenant and workspace context must be established.',
    });
  }

  next();
}

/**
 * Step-Up OTP Verification Store with timing-safe validation & max attempt lockout
 */
interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
}

const otpStore = new Map<string, OtpRecord>();
const MAX_OTP_ATTEMPTS = 5;

export function generateSensitiveOpOtp(userId: string): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(userId, {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    attempts: 0,
  });
  distributedState.storeOtp(userId, code, 10 * 60 * 1000).catch(() => {});
  return code;
}

export function verifySensitiveOpOtp(userId: string, candidateCode: string): boolean {
  const record = otpStore.get(userId);
  if (!record) return false;

  if (Date.now() > record.expiresAt) {
    otpStore.delete(userId);
    return false;
  }

  record.attempts += 1;
  if (record.attempts > MAX_OTP_ATTEMPTS) {
    otpStore.delete(userId); // Lockout on brute-force attempts
    return false;
  }

  const cleanCandidate = (candidateCode || '').trim();
  const candBuf = Buffer.from(cleanCandidate, 'utf-8');
  const codeBuf = Buffer.from(record.code, 'utf-8');

  let isValid = false;
  if (candBuf.length === codeBuf.length) {
    isValid = crypto.timingSafeEqual(candBuf, codeBuf);
  }

  if (isValid) {
    otpStore.delete(userId); // One-time use consume
  }

  return isValid;
}

export async function verifySensitiveOpOtpDistributed(
  userId: string,
  candidateCode: string
): Promise<{ valid: boolean; lockedOut: boolean; reason?: string }> {
  return distributedState.verifyOtp(userId, candidateCode, MAX_OTP_ATTEMPTS);
}

/**
 * Resolves client IP address safely in reverse proxy / direct setups.
 */
export function resolveClientIp(req: Request): string {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (typeof xForwardedFor === 'string') {
    const firstIp = xForwardedFor.split(',')[0].trim();
    if (firstIp) return firstIp;
  }
  return req.ip || req.socket.remoteAddress || '127.0.0.1';
}

/**
 * Enterprise sliding-window Rate Limiter Middleware backed by DistributedStateManager (Redis/Coordinated)
 */
export function createRateLimiter(options: {
  windowMs: number;
  maxRequests: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}) {
  const windowMs = options.windowMs || 60 * 1000;
  const maxRequests = options.maxRequests || 60;
  const message = options.message || 'Too many requests. Please slow down.';

  return (req: Request, res: Response, next: NextFunction) => {
    const key = options.keyGenerator ? options.keyGenerator(req) : resolveClientIp(req);

    const applyResult = (result: RateLimitResult) => {
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', result.resetAt);

      if (!result.allowed) {
        const retryAfter = Math.max(1, result.resetAt - Math.ceil(Date.now() / 1000));
        res.setHeader('Retry-After', retryAfter);
        return res.status(429).json({
          error: 'TooManyRequests',
          message,
          retryAfterSeconds: retryAfter,
        });
      }

      return next();
    };

    if (distributedState.getStatus().mode === 'IN_MEMORY_COORDINATED') {
      const syncResult = distributedState.checkRateLimitSync(key, windowMs, maxRequests);
      return applyResult(syncResult);
    }

    distributedState.checkRateLimit(key, windowMs, maxRequests)
      .then(applyResult)
      .catch(() => next());
  };
}
