import { describe, it, expect, vi } from "vitest";
import { Cache } from "../utils/cache.js";

describe("Cache class", () => {
  it("should store and retrieve a cached value", () => {
    const cache = new Cache(1);
    cache.set("key1", "value1");

    const result = cache.get("key1");
    expect(result).toBe("value1");
  });

  it("should return null for expired cache entries", async () => {
    const cache = new Cache(0.001);
    cache.set("key2", "expired-value");

    await new Promise((r) => setTimeout(r, 10));
    const result = cache.get("key2");
    expect(result).toBeNull();
  });

  it("should delete a specific key", () => {
    const cache = new Cache();
    cache.set("key3", "to-delete");

    cache.delete("key3");
    expect(cache.get("key3")).toBeNull();
  });

  it("should clear all keys", () => {
    const cache = new Cache();
    cache.set("a", 1);
    cache.set("b", 2);

    cache.clear();

    expect(cache.get("a")).toBeNull();
    expect(cache.get("b")).toBeNull();
  });

  it("should use remember() to cache and reuse values", async () => {
    const cache = new Cache(1);
    const fetcher = vi.fn(async () => "fetched-value");

    const value1 = await cache.remember("remember-key", 60, fetcher);
    const value2 = await cache.remember("remember-key", 60, fetcher);

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(value1).toBe("fetched-value");
    expect(value2).toBe("fetched-value");
  });

  it("should re-fetch when TTL expires in remember()", async () => {
    const cache = new Cache(0.001);
    const fetcher = vi.fn(async () => "new-value");

    await cache.remember("ttl-key", 0.001, fetcher);
    await new Promise((r) => setTimeout(r, 10));
    await cache.remember("ttl-key", 0.001, fetcher);

    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
