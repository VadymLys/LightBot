import { MiddlewareFn } from "grammy";
import { pool } from "../db/dbCloud.js";
import { MyContext, TelegramUser } from "../types/types.js";

export const authMiddleware: MiddlewareFn<MyContext> = async (ctx, next) => {
  const userId = ctx.from?.id;

  if (!userId) {
    await ctx.reply("❌ User ID not found");
    return;
  }

  const rows = await pool`
    SELECT auth_token, token_expires_at 
    FROM telegram_users 
    WHERE telegram_id = ${userId}
  `;

  const user = rows[0] as TelegramUser;

  if (
    !user ||
    !user.auth_token ||
    !user.token_expires_at ||
    new Date(user.token_expires_at) < new Date()
  ) {
    await ctx.reply("🔒 Session expired or not authorized. Use /login.");
    return;
  }

  // 🕒 Автоматичне продовження токена
  const newExpiry = new Date(Date.now() + 60 * 60 * 1000);

  await pool`
    UPDATE telegram_users 
    SET token_expires_at = ${newExpiry} 
    WHERE telegram_id = ${userId}
  `;

  ctx.user = user;

  return next();
};
