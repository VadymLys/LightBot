import { describe, it, expect, vi } from "vitest";
import { generateAccessTokenTelegram } from "../handlers/jwthandler";
import { authMiddleware } from "../middleware/auth-middleware";
import { pool } from "../db/dbCloud.js";
import { MyContext } from "../types/types.js";
import * as handlerModule from "../handlers/handleCore";

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
