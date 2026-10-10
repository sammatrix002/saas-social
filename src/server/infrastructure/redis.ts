/**
 * WhatsOmni v3.0 — Enterprise Distributed Redis Infrastructure Layer
 * Provides distributed rate limiting, atomic OTP state locks, and distributed worker coordination.
 */

import Redis from 'ioredis';

export interface IRedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, mode?: string, duration?: number): Promise<string | null>;
  setnx(key: string, value: string): Promise<number>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  del(key: string): Promise<number>;
  ttl(key: string): Promise<number>;
  ping(): Promise<string>;
  isAvailable(): boolean;
  disconnect(): Promise<void>;
  // High-level atomic distributed primitives
  incrWithExpire(key: string, expireSeconds: number): Promise<number>;
  acquireLock(lockKey: string, ttlSeconds: number): Promise<boolean>;
  releaseLock(lockKey: string): Promise<boolean>;
}

/**
 * High-performance in-memory Redis emulator with exact Redis atomic semantics.
 * Used for development, CI/CD, and single-instance environments without an external Redis daemon.
 */
class InMemoryRedisEmulator implements IRedisClient {
  private store = new Map<string, string>();
  private expiries = new Map<string, number>();

  private isExpired(key: string): boolean {
    const exp = this.expiries.get(key);
    if (exp && Date.now() > exp) {
      this.store.delete(key);
      this.expiries.delete(key);
      return true;
    }
    return false;
  }

  async get(key: string): Promise<string | null> {
    if (this.isExpired(key)) return null;
    return this.store.get(key) ?? null;
  }

  async set(key: string, value: string, mode?: string, duration?: number): Promise<string | null> {
    this.store.set(key, value);
    if (mode === 'EX' && duration) {
      this.expiries.set(key, Date.now() + duration * 1000);
    } else if (mode === 'PX' && duration) {
      this.expiries.set(key, Date.now() + duration);
    }
    return 'OK';
  }

  async setnx(key: string, value: string): Promise<number> {
    if (this.isExpired(key) || !this.store.has(key)) {
      this.store.set(key, value);
      return 1;
    }
    return 0;
  }

  async incr(key: string): Promise<number> {
    if (this.isExpired(key)) {
      this.store.delete(key);
    }
    const cur = parseInt(this.store.get(key) || '0', 10);
    const next = cur + 1;
    this.store.set(key, next.toString());
    return next;
  }

  async expire(key: string, seconds: number): Promise<number> {
    if (!this.store.has(key) || this.isExpired(key)) return 0;
    this.expiries.set(key, Date.now() + seconds * 1000);
    return 1;
  }

  async del(key: string): Promise<number> {
    this.expiries.delete(key);
    return this.store.delete(key) ? 1 : 0;
  }

  async ttl(key: string): Promise<number> {
    if (!this.store.has(key) || this.isExpired(key)) return -2;
    const exp = this.expiries.get(key);
    if (!exp) return -1;
    return Math.max(0, Math.ceil((exp - Date.now()) / 1000));
  }

  async ping(): Promise<string> {
    return 'PONG';
  }

  isAvailable(): boolean {
    return true;
  }

  async disconnect(): Promise<void> {
    this.store.clear();
    this.expiries.clear();
  }

  async incrWithExpire(key: string, expireSeconds: number): Promise<number> {
    const val = await this.incr(key);
    if (val === 1) {
      await this.expire(key, expireSeconds);
    }
    return val;
  }

  async acquireLock(lockKey: string, ttlSeconds: number): Promise<boolean> {
    const token = Date.now().toString();
    if (this.isExpired(lockKey) || !this.store.has(lockKey)) {
      await this.set(lockKey, token, 'EX', ttlSeconds);
      return true;
    }
    return false;
  }

  async releaseLock(lockKey: string): Promise<boolean> {
    return (await this.del(lockKey)) > 0;
  }
}

/**
 * Production Redis Client wrapper using ioredis.
 */
class ProductionRedisClient implements IRedisClient {
  private client: Redis;
  private connected = false;

  constructor(url: string) {
    this.client = new Redis(url, {
      maxRetriesPerRequest: 2,
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 100, 1000);
      },
      enableReadyCheck: true,
      lazyConnect: true,
    });

    this.client.on('connect', () => {
      this.connected = true;
    });

    this.client.on('error', (err) => {
      this.connected = false;
      console.warn('[Redis] Connection warning:', err.message);
    });
  }

  async connectIfNeeded() {
    if (!this.connected && this.client.status === 'wait') {
      try {
        await this.client.connect();
        this.connected = true;
      } catch (err: any) {
        this.connected = false;
        console.warn('[Redis] Failed to connect:', err.message);
      }
    }
  }

  async get(key: string): Promise<string | null> {
    await this.connectIfNeeded();
    return this.client.get(key);
  }

  async set(key: string, value: string, mode?: string, duration?: number): Promise<string | null> {
    await this.connectIfNeeded();
    if (mode === 'EX' && duration) {
      return this.client.set(key, value, 'EX', duration);
    }
    return this.client.set(key, value);
  }

  async setnx(key: string, value: string): Promise<number> {
    await this.connectIfNeeded();
    return this.client.setnx(key, value);
  }

  async incr(key: string): Promise<number> {
    await this.connectIfNeeded();
    return this.client.incr(key);
  }

  async expire(key: string, seconds: number): Promise<number> {
    await this.connectIfNeeded();
    return this.client.expire(key, seconds);
  }

  async del(key: string): Promise<number> {
    await this.connectIfNeeded();
    return this.client.del(key);
  }

  async ttl(key: string): Promise<number> {
    await this.connectIfNeeded();
    return this.client.ttl(key);
  }

  async ping(): Promise<string> {
    await this.connectIfNeeded();
    return this.client.ping();
  }

  isAvailable(): boolean {
    return this.connected;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit().catch(() => {});
      this.connected = false;
    }
  }

  async incrWithExpire(key: string, expireSeconds: number): Promise<number> {
    await this.connectIfNeeded();
    // Atomic multi pipeline to prevent orphaned un-expired keys
    const pipeline = this.client.multi();
    pipeline.incr(key);
    pipeline.ttl(key);
    const results = await pipeline.exec();
    const count = (results?.[0]?.[1] as number) || 1;
    const ttl = (results?.[1]?.[1] as number) || -1;
    if (ttl === -1) {
      await this.client.expire(key, expireSeconds);
    }
    return count;
  }

  async acquireLock(lockKey: string, ttlSeconds: number): Promise<boolean> {
    await this.connectIfNeeded();
    const token = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const result = await this.client.set(lockKey, token, 'EX', ttlSeconds, 'NX');
    return result === 'OK';
  }

  async releaseLock(lockKey: string): Promise<boolean> {
    await this.connectIfNeeded();
    const result = await this.client.del(lockKey);
    return result > 0;
  }
}

// Factory to resolve appropriate Redis driver
export function createRedisClient(): IRedisClient {
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl && redisUrl.startsWith('redis://') && process.env.FORCE_IN_MEMORY_REDIS !== 'true') {
    return new ProductionRedisClient(redisUrl);
  }
  return new InMemoryRedisEmulator();
}

export const redis = createRedisClient();
