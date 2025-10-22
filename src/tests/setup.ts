import { vi } from "vitest";
import { pool } from "../db/db.js";

if (process.env.NODE_ENV !== "production") {
  import("dotenv").then((dotenv) => dotenv.config({ path: ".env.test" }));
}

vi.spyOn(console, "log").mockImplementation(() => {});
vi.spyOn(console, "error").mockImplementation(() => {});
vi.spyOn(console, "warn").mockImplementation(() => {});

process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";
process.env.API_KEY = process.env.API_KEY || "test_api_key";
process.env.TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || "test_telegram_token";

(globalThis as any).__TEST_DB__ = true;

beforeAll(async () => {
  try {
    await pool.query("SELECT 1");
  } catch (err) {
    console.error("❌ DB connection error in vitest.setup.ts:", err);
  }
});

afterAll(async () => {
  await pool.end();
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
