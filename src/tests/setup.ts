import { vi, beforeEach } from "vitest";

if (process.env.NODE_ENV !== "production") {
  import("dotenv").then((dotenv) => dotenv.config());
}

process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";
process.env.API_KEY = process.env.API_KEY || "test_api_key";
process.env.TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || "test_telegram_token";
process.env.DB_URL =
  process.env.DB_URL ||
  "postgresql://test_user:test_password@localhost:5432/test_db";

vi.spyOn(console, "log").mockImplementation(() => {});
vi.spyOn(console, "error").mockImplementation(() => {});
vi.spyOn(console, "warn").mockImplementation(() => {});

beforeEach(() => {
  vi.clearAllMocks();
});

vi.mock("../db/dbCloud.js", () => {
  const mockUser = {
    auth_token: "mock_token",
    token_expires_at: new Date(Date.now() + 3600000),
  };

  const mockTaggedTemplate = vi.fn(async (strings, ...values) => {
    if (strings[0].includes("SELECT")) {
      return [mockUser];
    }
    if (strings[0].includes("UPDATE")) {
      return [];
    }
    return [];
  });

  return {
    pool: mockTaggedTemplate,
  };
});

vi.mock("../handlers/handleCore.js", () => ({
  handlerCore: vi.fn().mockResolvedValue({
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      data: [
        { price: 10.5, time: "2024-01-01T10:00:00Z" },
        { price: 12.3, time: "2024-01-01T11:00:00Z" },
      ],
    }),
  }),
}));

vi.mock("../bots/Telegram/TelegramBot.ts", () => {
  return {
    bot: {
      command: vi.fn(),
      use: vi.fn(),
      on: vi.fn(),
      start: vi.fn(),
      reply: vi.fn(),
    },
  };
});

vi.mock("../Api/esiosGetApi.js", () => ({
  esiosApi: {
    indicators: vi
      .fn()
      .mockResolvedValue([
        { datetime: "2024-01-01T10:00:00Z", value: 150.5, geo_id: 1 },
      ]),
  },
}));

vi.mock("../utils/formatIndicatorMessage.js", () => ({
  formatIndicatorMessage: vi
    .fn()
    .mockReturnValue([{ price: 150.5, time: "2024-01-01T10:00:00Z" }]),
}));
