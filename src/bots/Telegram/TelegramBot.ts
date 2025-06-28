import { Bot } from "grammy";
import dotenv from "dotenv";

dotenv.config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;

if (!botToken) {
  throw new Error("Please provide TELEGRAM_BOT_TOKEN in .env file");
}

export const bot = new Bot(botToken);
