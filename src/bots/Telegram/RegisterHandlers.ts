import { ResponseHandler } from "../../handlers/responseHandler.js";
import { today, toISODate, tomorrow } from "../../utils/DateConverter.js";
import { handlerCore } from "../../handlers/handleCore.js";
import { bot } from "./TelegramBot.js";
import { generateAccessTokenTelegram } from "../../handlers/jwthandler.js";
import { pool } from "../../db/dbCloud.js";
import { authMiddleware } from "../../middleware/auth-middleware.js";
import { cache } from "../../utils/cache.js";

export const registerHandlers = () => {
  bot.use(async (ctx, next) => {
    console.log("📥 New update received:", ctx.update);
    await next();
  });

  bot.command("login", async (ctx) => {
    try {
      const userId = ctx.from?.id;
      const username = ctx.from?.username;

      if (!userId) {
        await ctx.reply("User ID  not found");
        return;
      }

      const token = generateAccessTokenTelegram(userId, username);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await pool`INSERT INTO telegram_users (telegram_id, username, auth_token, token_expires_at)
      VALUES (${userId}, ${username}, ${token}, ${expiresAt})
      ON CONFLICT (telegram_id)
      DO UPDATE SET
        username = EXCLUDED.username,
        auth_token = EXCLUDED.auth_token,
        token_expires_at = EXCLUDED.token_expires_at`;

      console.log("✅ Token saved/updated for:", userId);

      await ctx.reply("Login successful!");
    } catch (err) {
      console.error("Login error:", err);
      await ctx.reply("❌ Error in login. Try again later.");
    }
  });

  bot.command("getdata", authMiddleware, async (ctx) => {
    try {
      if (!ctx.user) {
        await ctx.reply("❌ User context missing. Please /login again.");
        return;
      }

      const event = {
        queryStringParameters: {
          id: "1001",
          start_date: toISODate(today),
          end_date: toISODate(tomorrow),
          geo_agg: "sum",
          time_trunc: "hour",
        },
        headers: {
          Authorization: `Bearer ${ctx.user.auth_token}`,
        },
      };

      const response = (await handlerCore(event as any)) as { body: string };

      if (!response.body) {
        throw new Error("Empty response body");
      }

      const parsed = JSON.parse(response.body);
      console.log("📊 Parsed response:", parsed);

      if (!parsed.success) {
        throw new Error(parsed.error || "API returned error");
      }

      const message = parsed.data;

      await ctx.reply("Your data:");

      if (Array.isArray(message) && message.length > 0) {
        const messageText = message.join("\n");
        if (messageText.length > 4096) {
          for (let i = 0; i < messageText.length; i += 4096) {
            await ctx.reply(messageText.substring(i, i + 4096));
          }
        } else {
          await ctx.reply(messageText);
        }
      } else {
        await ctx.reply("No data available");
      }
    } catch (err: unknown) {
      console.error("💥 Error in getdata command:", err);
      const errorMessage = `❌ Error: ${
        err instanceof Error ? err.message : String(err)
      }`;
      await ctx.reply(errorMessage);
    }
  });

  bot.command("help", (ctx) =>
    ctx.reply("Write /login to get started and /getdata to get data")
  );

  bot.command("cachestats", async (ctx) => {
    const stats = cache.getStats();
    await ctx.reply(`Cache stats: ${JSON.stringify(stats, null, 2)}`);
  });

  bot.command("clearcache", async (ctx) => {
    cache.clear();
    await ctx.reply("✅ Cache cleared");
  });

  bot.on("message:text", async (ctx, next) => {
    const text = ctx.message.text;
    if (text.startsWith("/")) {
      await ctx.reply(`Unknown command. Use /help to see available commands.`);
    } else {
      await ctx.reply("💬 I only understand commands. Try /help.");
    }
    await next();
  });
};
