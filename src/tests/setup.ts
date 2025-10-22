import { vi } from "vitest";

if (process.env.NODE_ENV !== "production") {
  import("dotenv").then((dotenv) => dotenv.config({ path: ".env.test" }));
}

process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";
process.env.API_KEY = process.env.API_KEY || "test_api_key";
process.env.TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || "test_telegram_token";
process.env.DB_HOST = process.env.DB_HOST || "localhost";
process.env.DB_PORT = process.env.DB_PORT || "5432";
process.env.DB_NAME = process.env.DB_NAME || "test_db";
process.env.DB_USER = process.env.DB_USER || "test_user";
process.env.DB_PASSWORD = process.env.DB_PASSWORD || "test_password";

vi.spyOn(console, "log").mockImplementation(() => {});
vi.spyOn(console, "error").mockImplementation(() => {});
vi.spyOn(console, "warn").mockImplementation(() => {});

vi.mock("../db/dbCloud.ts", () => {
  return {
    pool: {
      query: vi.fn().mockResolvedValue([]),
      end: vi.fn(),
    },
  };
});

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
