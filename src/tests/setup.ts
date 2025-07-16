import dotenv from "dotenv";
import { vi } from "vitest";

// Завантажуємо змінні середовища з .env
dotenv.config();

// Моки для console, щоб не засмічувати тестовий вивід
vi.spyOn(console, "log").mockImplementation(() => {});
vi.spyOn(console, "error").mockImplementation(() => {});
vi.spyOn(console, "warn").mockImplementation(() => {});

(globalThis as any).__TEST_DB__ = true;

import { pool } from "../db/db.js";

// Перевірка підключення до бази перед усіма тестами
beforeAll(async () => {
  try {
    await pool.query("SELECT 1"); // ping DB
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
