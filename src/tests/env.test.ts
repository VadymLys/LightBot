import { describe, it, expect } from "vitest";

describe("Environment variables in CI", () => {
  it("should load secrets from GitHub Actions", () => {
    console.log("🔍 JWT_SECRET:", process.env.JWT_SECRET);
    console.log("🔍 API_KEY:", process.env.API_KEY);
    console.log("🔍 TELEGRAM_BOT_TOKEN:", process.env.TELEGRAM_BOT_TOKEN);

    expect(process.env.JWT_SECRET).toBeDefined();
    expect(process.env.API_KEY).toBeDefined();
    expect(process.env.TELEGRAM_BOT_TOKEN).toBeDefined();
  });
});
