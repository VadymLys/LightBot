import dotenv from "dotenv";
import { vi } from "vitest";

dotenv.config();

vi.spyOn(console, "log").mockImplementation(() => {});
vi.spyOn(console, "error").mockImplementation(() => {});
vi.spyOn(console, "warn").mockImplementation(() => {});

(globalThis as any).__TEST_DB__ = true;

import { pool } from "../db/db.js";

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
