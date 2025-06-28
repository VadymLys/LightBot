import { ResponseHandler } from "../../handlers/responseHandler.js";
import { today, toISODate, tomorrow } from "../../utils/DateConverter.js";
import { handlerCore } from "../../handlers/handleCore.js";
import { bot } from "./TelegramBot.js";

export const registerHandlers = () => {
  bot.use(async (ctx, next) => {
    console.log("📥 New update received:", ctx.update);
    await next();
  });

  bot.command("getdata", async (ctx) => {
    const event = {
      queryStringParameters: {
        id: "1001",
        start_date: toISODate(today),
        end_date: toISODate(tomorrow),
        geo_agg: "sum",
        time_trunc: "hour",
      },
    };

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
