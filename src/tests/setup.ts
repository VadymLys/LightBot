import { vi } from "vitest";
import dotenv from "dotenv";
import { pool } from "../db/db.js";

dotenv.config({ path: ".env.test" });

process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";
process.env.API_KEY = process.env.API_KEY || "test_api_key";
process.env.TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || "test_telegram_token";
process.env.DB_URL =
  process.env.DB_URL ||
  `postgresql://${process.env.DB_USER || "test_user"}:${
    process.env.DB_PASSWORD || "test_password"
  }@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || "5432"}/${
    process.env.DB_NAME || "test_db"
  }`;

vi.mock("../db/dbCloud.ts", () => ({
  pool: {
    query: vi.fn().mockResolvedValue({ rows: [] }),
    end: vi.fn(),
  },
}));
// 5️⃣ Глушимо логи
vi.spyOn(console, "log").mockImplementation(() => {});
vi.spyOn(console, "error").mockImplementation(() => {});
vi.spyOn(console, "warn").mockImplementation(() => {});

// 6️⃣ Маркер для тестів
(globalThis as any).__TEST_DB__ = true;

// 7️⃣ Ініціалізація/закриття бази
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

vi.mock("../bots/Telegram/TelegramBot.ts", () => ({
  bot: {
    command: vi.fn(),
    use: vi.fn(),
    on: vi.fn(),
    start: vi.fn(),
    reply: vi.fn(),
  },
}));

vi.mock("../db/dbCloud.js", () => ({
  pool: {
    query: vi.fn().mockResolvedValue({
      rows: [{ auth_token: null, token_expires_at: new Date() }],
    }),
  },
}));
