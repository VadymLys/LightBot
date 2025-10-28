import { CacheEntry } from "../types/types.js";

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
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  delete(key: string) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  async remember<T>(
    key: string,
    ttlSeconds: number,
    fetcher: () => Promise<T>
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached) {
      console.log(`✅ Cache hit: ${key}`);
      return cached;
    }

    console.log(`cache miss: ${key}`);

    const result = await fetcher();

    if (result === undefined || result === null) {
      console.warn(`⚠️ Fetcher for ${key} returned no data`);
    }

    this.set<T>(key, result, ttlSeconds);
    return result;
  }
}

export const cache = new Cache(60);
