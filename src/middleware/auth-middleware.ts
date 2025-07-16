import { MiddlewareFn } from "grammy";
import { pool } from "../db/db.js";
import { MyContext } from "../types/types.js";

export const authMiddleware: MiddlewareFn<MyContext> = async (ctx, next) => {
  const userId = ctx.from?.id;

  if (!userId) {
    await ctx.reply("❌ User ID not found");
    return;
  }

  const { rows } = await pool.query(
    `SELECT auth_token, token_expires_at FROM telegram_users WHERE telegram_id = $1`,
    [userId]
  );

  const user = rows[0];

  if (
    !user ||
    !user.auth_token ||
    new Date(user.token_expires_at) < new Date()
  ) {
    await ctx.reply("🔒 Session expired or not authorized. Use /login.");
    return;
  }

  // 🔁 Автоматично подовжуємо сесію (наприклад, на 1 годину)
  const newExpiry = new Date(Date.now() + 60 * 60 * 1000);
  await pool.query(
    `UPDATE telegram_users SET token_expires_at = $1 WHERE telegram_id = $2`,
    [newExpiry, userId]
  );

  ctx.user = user;

  // 👇 передаємо управління далі
  return next();
};
