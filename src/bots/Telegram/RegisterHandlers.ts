import { ResponseHandler } from "../../handlers/responseHandler.js";
import { today, toISODate, tomorrow } from "../../utils/DateConverter.js";
import { handlerCore } from "../../handlers/handleCore.js";
import { bot } from "./TelegramBot.js";
import { generateAccessTokenTelegram } from "../../handlers/jwthandler.js";
import { pool } from "../../db/dbCloud.js";
import { authMiddleware } from "../../middleware/auth-middleware.js";

export const registerHandlers = () => {
  bot.use(async (ctx, next) => {
    console.log("📥 New update received:", ctx.update);
    await next();
  });

  bot.command("login", async (ctx) => {
    const userId = ctx.from?.id;
    const username = ctx.from?.username;

    if (!userId) {
      await ctx.reply("User ID  not found");
      return;
    }

    const token = generateAccessTokenTelegram(userId, username);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    const rows = await pool`
      SELECT * FROM telegram_users WHERE telegram_id = ${userId}`;

    console.log("✅ Token saved/updated for:", userId);

    if (rows.length === 0) {
      await pool`INSERT INTO telegram_users (telegram_id, username, auth_token, token_expires_at)
         VALUES (
        ${userId}, ${username}, ${token}, ${expiresAt}
      )`;
    } else {
      await pool`UPDATE telegram_users SET auth_token = ${token}, token_expires_at = ${expiresAt} WHERE telegram_id=${userId}`;
    }

    await ctx.reply("Login successful!");
    await ctx.reply(token);
  });

  bot.command("getdata", authMiddleware, async (ctx) => {
    const event = {
      queryStringParameters: {
        id: "1001",
        start_date: toISODate(today),
        end_date: toISODate(tomorrow),
        geo_agg: "sum",
        time_trunc: "hour",
      },
    };

    const rows =
      await pool`SELECT auth_token, token_expires_at FROM telegram_users WHERE telegram_id = ${ctx.from?.id}`;

    console.log("🧾 User row:", rows);

    console.log("🕒 Token expires at:", new Date(rows[0].token_expires_at));
    console.log("🕒 Current time:", new Date());

    if (
      !rows[0] ||
      !rows[0].auth_token ||
      new Date(rows[0].token_expires_at) < new Date()
    ) {
      await ctx.reply(
        "❌ You are not authorized or your session expired. Use /login again."
      );
      return;
    }

    try {
      const response = await handlerCore(event as any);
      const parsed = JSON.parse(response.body);
      const message = parsed.data;
      console.log("🚀 ~ bot.command ~ message:", message);

      await ctx.reply("your data:");
      await ctx.reply(message.join("\n"));
    } catch (err: unknown) {
      const errorMessage = `[${new Date().toISOString()}] ❌ Error ${
        err instanceof Error ? err.message : String(err)
      }`;
      ResponseHandler.error(errorMessage);
      await ctx.reply(
        "Error occurred while fetching data. Please try again later."
      );
    }
  });

  bot.command("start", (ctx) => ctx.reply("Hi, I'm your bot"));

  bot.command("help", (ctx) => ctx.reply("Write /start for start"));

  bot.on("message:text", (ctx) => {
    ctx.reply(`You wrote: ${ctx.message.text}`);
  });
};
