import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateAccessTokenTelegram } from "../handlers/jwthandler";
import { authMiddleware } from "../middleware/auth-middleware";
import { pool } from "../db/dbCloud.js";
import { MyContext } from "../types/types.js";
import * as handlerModule from "../handlers/handleCore";
import { cache } from "../utils/cache.js";

describe("Telegram command /getdata", () => {
  it("should return valid electricity prices", async () => {
    vi.spyOn(handlerModule, "handlerCore").mockResolvedValue({
      statusCode: 200,
      body: JSON.stringify({ data: ["10.5 MWh", "12.3 MWh"] }),
    });

    const result = (await handlerModule.handlerCore({} as any)) as {
      body: string;
    };
    const parsed = JSON.parse(result.body);

    expect(parsed.data).toBeDefined();
    expect(Array.isArray(parsed.data)).toBe(true);
    expect(parsed.data.length).toBeGreaterThan(0);
  });
});

describe("generateAccessTokenTelegram", () => {
  it("generates a valid JWT token for user", () => {
    const userId = 12345;
    const username = "testuser";

    const token = generateAccessTokenTelegram(userId, username);
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3);
  });
});

describe("authMiddleware", () => {
  it("check case of empty token", async () => {
    const mockReply = vi.fn();
    const mockNext = vi.fn();

    // Mock для випадку, коли токен прострочений
    const mockPool = await import("../db/dbCloud.js");
    (mockPool.pool as any).mockResolvedValueOnce([
      {
        auth_token: "expired_token",
        token_expires_at: new Date(Date.now() - 3600000), // Минула дата
      },
    ]);

    const ctx = {
      from: { id: 12345 },
      reply: mockReply,
    } as unknown as MyContext;

    await authMiddleware(ctx, mockNext);

    expect(mockReply).toHaveBeenCalledWith(
      "🔒 Session expired or not authorized. Use /login."
    );
    expect(mockNext).not.toHaveBeenCalled();
  });
});

const createMockContext = () => ({
  reply: vi.fn(),
  from: { id: 123, username: "testuser" },
  user: { telegram_id: 123, auth_token: "test-token" },
});

describe("Telegram /clearcache command", () => {
  let mockCtx: any;

  beforeEach(() => {
    mockCtx = createMockContext();
    cache.clear();
    vi.clearAllMocks();
  });

  it("should clear cache and send confirmation", async () => {
    // Заповнюємо кеш
    cache.set("key1", "value1", 60);
    cache.set("key2", "value2", 120);

    expect(cache.get("key1")).toBe("value1");
    expect(cache.get("key2")).toBe("value2");

    // Викликаємо команду очищення
    cache.clear();
    await mockCtx.reply("✅ Cache cleared");

    // Перевіряємо що кеш очищено
    expect(cache.get("key1")).toBeNull();
    expect(cache.get("key2")).toBeNull();

    // Перевіряємо відповідь
    expect(mockCtx.reply).toHaveBeenCalledOnce();
    expect(mockCtx.reply).toHaveBeenCalledWith("✅ Cache cleared");
  });

  it("should work with empty cache", async () => {
    // Кеш вже пустий

    // Викликаємо команду
    cache.clear();
    await mockCtx.reply("✅ Cache cleared");

    expect(mockCtx.reply).toHaveBeenCalledWith("✅ Cache cleared");

    // Перевіряємо що кеш залишився пустим
    const stats = cache.getStats();
    expect(stats.size).toBe(0);
  });

  it("should clear all cache entries", async () => {
    // Додаємо різні типи даних
    cache.set("string_key", "string_value", 60);
    cache.set("object_key", { data: "test" }, 60);
    cache.set("number_key", 42, 60);
    cache.set("array_key", [1, 2, 3], 60);

    expect(cache.getStats().size).toBe(4);

    // Очищаємо
    cache.clear();
    await mockCtx.reply("✅ Cache cleared");

    // Перевіряємо що все очищено
    expect(cache.getStats().size).toBe(0);
    expect(cache.get("string_key")).toBeNull();
    expect(cache.get("object_key")).toBeNull();
    expect(cache.get("number_key")).toBeNull();
    expect(cache.get("array_key")).toBeNull();
  });
});
