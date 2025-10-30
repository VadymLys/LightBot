import fetch from "node-fetch";
import "dotenv/config";

const token = process.env.TELEGRAM_BOT_TOKEN;
const lambdaUrl = process.env.LAMBDA_WEBHOOK_URL;

if (!token) {
  console.error("❌ Помилка: TELEGRAM_BOT_TOKEN не знайдено в .env файлі!");
  process.exit(1);
}

if (!lambdaUrl) {
  console.error("❌ Помилка: LAMBDA_WEBHOOK_URL не знайдено в .env файлі!");
  console.log("👉 Додай його в .env, наприклад:");
  console.log(
    "LAMBDA_WEBHOOK_URL=https://ho3tllx9tk.execute-api.us-east-1.amazonaws.com/dev"
  );
  process.exit(1);
}

const TELEGRAM_API = `https://api.telegram.org/bot${token}`;

async function checkWebhook() {
  try {
    console.log("🔍 Перевіряю вебхук...");
    const res = await fetch(`${TELEGRAM_API}/getWebhookInfo`);
    const data = await res.json();

    if (!data.ok) {
      console.error("❌ Telegram API повернув помилку:", data);
      return;
    }

    const info = data.result;
    console.log("📡 Поточна інформація про вебхук:");
    console.log(JSON.stringify(info, null, 2));

    const hasError = !!info.last_error_message;
    const noUrl = !info.url || info.url.trim() === "";

    if (noUrl || hasError || info.url !== lambdaUrl) {
      console.warn("⚠️ Вебхук неактивний або неправильний. Оновлюю...");
      await setWebhook();
    } else {
      console.log("✅ Вебхук активний і працює!");
    }
  } catch (err) {
    console.error("💥 Помилка перевірки вебхука:", err);
  }
}

async function setWebhook() {
  try {
    const res = await fetch(`${TELEGRAM_API}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: lambdaUrl }),
    });
    const data = await res.json();

    if (data.ok) {
      console.log(`✅ Вебхук оновлено: ${lambdaUrl}`);
    } else {
      console.error("❌ Не вдалося встановити вебхук:", data);
    }
  } catch (err) {
    console.error("💥 Помилка встановлення вебхука:", err);
  }
}

checkWebhook();
