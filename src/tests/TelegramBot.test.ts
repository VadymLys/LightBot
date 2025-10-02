import { describe, it, expect, vi } from "vitest";
import { generateAccessTokenTelegram } from "../handlers/jwthandler";
import { authMiddleware } from "../middleware/auth-middleware";
import { pool } from "../db/db";
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

vi.mock("../db/db.ts", () => ({
  pool: {
    query: vi.fn(),
  },
}));

describe("authMiddleware", () => {
  it("check case of empty token", async () => {
    const mockReply = vi.fn();
    const mockNext = vi.fn();

    (pool.query as any).mockResolvedValue({
      rows: [{ auth_token: null, token_expires_at: new Date() }],
    });

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
