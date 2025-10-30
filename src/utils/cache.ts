import { CacheEntry } from "../types/types.js";

import { pool } from "../db/dbCloud.js";

export class Cache {
  private store = new Map<string, CacheEntry>();
  private defaultTTL: number;

  constructor(defaultTTLSeconds = 60) {
    this.defaultTTL = defaultTTLSeconds * 1000;
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlSeconds?: number) {
    const ttl = (ttlSeconds ?? this.defaultTTL / 1000) * 1000;
    this.store.set(key, { value, expiresAt: Date.now() + ttl });
  }

  delete(key: string) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  getStats() {
    return {
      size: this.store.size,
      keys: Array.from(this.store.keys()),
      entries: Array.from(this.store.entries()).map(
        ([key, entry]: [string, CacheEntry]) => ({
          key,
          expiresIn: entry.expiresAt - Date.now(),
        })
      ),
    };
  }

  private async getDbCache<T>(key: string): Promise<T | null> {
    const result =
      await pool`SELECT value, expires_at FROM cache WHERE key = ${key}`;
    if (result.length && new Date() < result[0].expires_at) {
      console.log("✅ DB cache hit:", key);
      return result[0].value as T;
    }
    console.log("🧊 DB cache miss:", key);
    return null;
  }

  private async setDbCache<T>(key: string, value: T, ttlSeconds: number) {
    const expires = new Date(Date.now() + ttlSeconds * 1000);
    await pool`
      INSERT INTO cache (key, value, expires_at)
      VALUES (${key}, ${value}, ${expires})
      ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value, expires_at = EXCLUDED.expires_at
    `;
  }

  async remember<T>(
    key: string,
    ttlSeconds: number,
    fetcher: () => Promise<T>
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached) {
      console.log(`✅ In-memory cache hit: ${key}`);
      return cached;
    }

    const dbCached = await this.getDbCache<T>(key);
    if (dbCached) {
      console.log(`✅ DB cache hit: ${key}`);
      this.set<T>(key, dbCached, ttlSeconds);
      return dbCached;
    }

    console.log(`❌ Cache miss: ${key}`);
    const result = await fetcher();

    this.set<T>(key, result, ttlSeconds);
    await this.setDbCache<T>(key, result, ttlSeconds);

    return result;
  }
}

export const cache = new Cache(60);
