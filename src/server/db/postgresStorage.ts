/**
 * WhatsOmni v3.0 — Enterprise PostgreSQL Storage Engine
 * Implements parameterized queries, connection pooling, multi-tenant isolation,
 * and transaction management across all 24 relational tables.
 */

import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

export const TABLE_NAME_MAP: Record<string, string> = {
  tenants: 'tenants',
  workspaces: 'workspaces',
  users: 'users',
  channels: 'channels',
  contacts: 'contacts',
  conversations: 'conversations',
  messages: 'messages',
  campaigns: 'campaigns',
  deals: 'deals',
  flows: 'flows',
  flowForms: 'flow_forms',
  catalogItems: 'catalog_items',
  chatbots: 'chatbots',
  knowledgeDocs: 'knowledge_docs',
  knowledgeChunks: 'knowledge_chunks',
  socialPosts: 'social_posts',
  broadcasts: 'broadcasts',
  staff: 'staff',
  abandonedCarts: 'abandoned_carts',
  paymentGateways: 'payment_gateways',
  currencies: 'currencies',
  plans: 'plans',
  rbacRoles: 'rbac_roles',
  webhookEvents: 'webhook_events',
  aiTelemetryLogs: 'ai_telemetry_logs',
  auditLogs: 'audit_logs',
};

export const ARRAY_COLUMNS = new Set(['tags', 'assigned_channels', 'platforms', 'available_days', 'supported_currencies']);

export function camelToSnake(str: string): string {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

export function toPgTableName(table: string): string {
  return TABLE_NAME_MAP[table] || camelToSnake(table);
}

export interface PostgresConfig {
  connectionString?: string;
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  maxPoolSize?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
  ssl?: boolean | { rejectUnauthorized: boolean };
}

export class PostgresStorageAdapter {
  private pool: Pool | null = null;
  private isConnected = false;
  private config: PostgresConfig;

  constructor(config: PostgresConfig = {}) {
    this.config = config;
  }

  public async connect(): Promise<boolean> {
    if (this.isConnected && this.pool) return true;

    const connectionString = this.config.connectionString || process.env.DATABASE_URL;
    if (!connectionString) {
      console.warn('[PostgreSQL] No DATABASE_URL provided. Operating in decoupled mode.');
      return false;
    }

    try {
      this.pool = new Pool({
        connectionString,
        max: this.config.maxPoolSize || 20,
        idleTimeoutMillis: this.config.idleTimeoutMillis || 30000,
        connectionTimeoutMillis: this.config.connectionTimeoutMillis || 5000,
        ssl: this.config.ssl ?? (process.env.NODE_ENV === 'production' && !connectionString.includes('127.0.0.1') ? { rejectUnauthorized: true } : false),
      });

      // Probe connection
      const client = await this.pool.connect();
      try {
        await client.query('SELECT 1 as probe;');
        this.isConnected = true;
        console.log('[PostgreSQL] Successfully connected to relational database pool.');
        return true;
      } finally {
        client.release();
      }
    } catch (err: any) {
      console.error('[PostgreSQL] Connection failed:', err.message);
      this.isConnected = false;
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.isConnected = false;
      console.log('[PostgreSQL] Database pool shut down cleanly.');
    }
  }

  public async querySql<T extends QueryResultRow = any>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
    if (!this.pool) {
      throw new Error('PostgreSQL pool is not connected.');
    }
    return this.pool.query<T>(sql, params);
  }

  /**
   * Executes atomic database transaction
   */
  public async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    if (!this.pool) {
      throw new Error('PostgreSQL pool is not connected.');
    }
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Parameterized CRUD with tenant scoping
   */
  public async findByTenant<T extends QueryResultRow = any>(table: string, tenantId: string, conditions: Record<string, any> = {}): Promise<T[]> {
    const pgTable = toPgTableName(table);
    const keys = Object.keys(conditions);
    const whereClauses = ['tenant_id = $1'];
    const values: any[] = [tenantId];

    keys.forEach((key, idx) => {
      whereClauses.push(`"${camelToSnake(key)}" = $${idx + 2}`);
      values.push(conditions[key]);
    });

    const sql = `SELECT * FROM "${pgTable}" WHERE ${whereClauses.join(' AND ')} ORDER BY created_at DESC;`;
    const res = await this.querySql<T>(sql, values);
    return res.rows;
  }

  public async findOneRecord<T extends QueryResultRow = any>(table: string, conditions: Record<string, any>): Promise<T | null> {
    const pgTable = toPgTableName(table);
    const keys = Object.keys(conditions);
    if (keys.length === 0) return null;

    const whereClauses: string[] = [];
    const values: any[] = [];

    keys.forEach((key, idx) => {
      whereClauses.push(`"${camelToSnake(key)}" = $${idx + 1}`);
      values.push(conditions[key]);
    });

    const sql = `SELECT * FROM "${pgTable}" WHERE ${whereClauses.join(' AND ')} LIMIT 1;`;
    const res = await this.querySql<T>(sql, values);
    return res.rows[0] || null;
  }

  public async insertRecord<T extends QueryResultRow = any>(table: string, record: Record<string, any>): Promise<T> {
    const pgTable = toPgTableName(table);
    const keys = Object.keys(record);
    const cols = keys.map((k) => `"${camelToSnake(k)}"`).join(', ');
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const values = keys.map((k) => {
      const val = record[k];
      const col = camelToSnake(k);
      if (Array.isArray(val)) {
        if (ARRAY_COLUMNS.has(col)) return val;
        return JSON.stringify(val);
      }
      if (typeof val === 'object' && val !== null) {
        return JSON.stringify(val);
      }
      return val;
    });

    const sql = `INSERT INTO "${pgTable}" (${cols}) VALUES (${placeholders}) RETURNING *;`;
    const res = await this.querySql<T>(sql, values);
    return res.rows[0];
  }

  public async updateRecord<T extends QueryResultRow = any>(
    table: string,
    id: string,
    tenantId: string,
    updates: Record<string, any>
  ): Promise<T | null> {
    const pgTable = toPgTableName(table);
    const keys = Object.keys(updates);
    if (keys.length === 0) return null;

    const setClauses: string[] = [];
    const values: any[] = [id, tenantId];

    keys.forEach((k, idx) => {
      const colName = `"${camelToSnake(k)}"`;
      setClauses.push(`${colName} = $${idx + 3}`);
      const val = updates[k];
      const col = camelToSnake(k);
      if (Array.isArray(val)) {
        values.push(ARRAY_COLUMNS.has(col) ? val : JSON.stringify(val));
      } else if (typeof val === 'object' && val !== null) {
        values.push(JSON.stringify(val));
      } else {
        values.push(val);
      }
    });

    setClauses.push('"updated_at" = NOW()');

    const sql = `UPDATE "${pgTable}" SET ${setClauses.join(', ')} WHERE id = $1 AND tenant_id = $2 RETURNING *;`;
    const res = await this.querySql<T>(sql, values);
    return res.rows[0] || null;
  }

  public async deleteRecord(table: string, id: string, tenantId: string): Promise<boolean> {
    const pgTable = toPgTableName(table);
    const sql = `DELETE FROM "${pgTable}" WHERE id = $1 AND tenant_id = $2;`;
    const res = await this.querySql(sql, [id, tenantId]);
    return (res.rowCount ?? 0) > 0;
  }

  public isHealthy(): { ok: boolean; connected: boolean; poolActive: boolean } {
    return {
      ok: this.isConnected,
      connected: this.isConnected,
      poolActive: !!this.pool,
    };
  }

  /**
   * Diagnostic verification of atomic transaction rollback
   */
  public async verifyTransactionRollback(): Promise<boolean> {
    if (!this.pool) return false;
    const testId = `rollback_probe_${Date.now()}`;
    try {
      await this.transaction(async (client) => {
        await client.query(
          `INSERT INTO "tenants" ("id", "name", "slug", "plan", "status", "created_at", "updated_at") VALUES ($1, $2, $3, $4, $5, NOW(), NOW());`,
          [testId, 'Rollback Test Tenant', `rollback-${Date.now()}`, 'Enterprise', 'active']
        );
        // Force intentional rollback
        throw new Error('SIMULATED_TRANSACTION_FAILURE');
      });
    } catch (err: any) {
      if (err.message !== 'SIMULATED_TRANSACTION_FAILURE') throw err;
    }

    const check = await this.querySql(`SELECT id FROM "tenants" WHERE id = $1;`, [testId]);
    return check.rows.length === 0;
  }

  /**
   * Diagnostic verification of SQL injection safety via parameters
   */
  public async verifyParameterizedSafety(): Promise<boolean> {
    if (!this.pool) return false;
    const maliciousPayload = "' OR '1'='1";
    const res = await this.querySql(`SELECT * FROM "tenants" WHERE name = $1;`, [maliciousPayload]);
    return Array.isArray(res.rows) && res.rows.length === 0;
  }

  /**
   * Diagnostic verification of connection pool concurrency
   */
  public async verifyPoolConcurrency(concurrency: number = 20): Promise<boolean> {
    if (!this.pool) return false;
    const tasks = Array.from({ length: concurrency }, async (_, i) => {
      const res = await this.querySql(`SELECT $1::int as val, NOW() as ts;`, [i]);
      return res.rows[0]?.val === i;
    });
    const results = await Promise.all(tasks);
    return results.every(Boolean);
  }
}
