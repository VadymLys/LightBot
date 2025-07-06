import { bot } from "./TelegramBot.js";
import { registerHandlers } from "./RegisterHandlers.js";

registerHandlers();

(async () => {
  await bot.init();
  console.log("🤖 Bot initialized locally");

  bot.start({
    onStart: () => {
      console.log("✅ Bot started in LOCAL DEV mode");
    },
  });
})();
