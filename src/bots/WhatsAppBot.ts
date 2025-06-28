import wweb from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { handlerCore } from "../handlers/handleCore.js";

const { Client, LocalAuth } = wweb;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  console.log("✅ WhatsApp-bot is ready!");

  try {
    await client.sendMessage(
      "34682341668@c.us",
      "Hello it`s me, Whatsapp-bot!"
    );
  } catch (error) {
    console.error("Помилка при відправленні повідомлення:", error);
  }
});

client.on("message", async (message) => {
  console.log(`📨 Повідомлення від ${message.from}: ${message.body}`);

  const text = message.body?.toLowerCase().trim();

  if (text === "привіт") {
    await message.reply("Hi, I`m Whatsapp-bot. How can I help you?");
  } else {
    await message.reply("Вибач, я поки не розумію це повідомлення.");
  }
});

client.on("message_create", async (message) => {
  console.log("Message created:", message.body);
  if (message.body.toLowerCase() === "luz") {
    try {
      const fakeEvent = {} as any;
      const data = await handlerCore(fakeEvent);
      const parsed = JSON.parse(data.body);
      const reply = parsed.data;
      await message.reply(Array.isArray(reply) ? reply.join("\n") : reply);
    } catch (err) {
      console.error("❌ Failed to fetch indicator:", err);
      await message.reply(
        "Вибач, не вдалося отримати дані про ціну на світло."
      );
    }
  }
});

client.initialize();
