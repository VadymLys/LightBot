# LuzAPI Telegram Bot

Telegram bot for fetching data from the ESIOS API with caching and user authentication via Telegram token. Supports deployment on AWS Lambda.

---

## 📦 Features

- Commands:
  - `/login` — register user and create a token
  - `/getdata` — fetch data from ESIOS API
  - `/help` — show available commands
- In-memory and PostgreSQL caching
- AWS Lambda support
- Telegram webhook integration

---

## ⚙️ Installation

git clone https://github.com/username/luzapi.git
cd luzapi
npm install

Create a .env file:
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
API_KEY=your_esios_api_key
DB_URL=postgresql://user:password@host:port/dbname
🚀 Usage

Local Development
npm run dev:bot

Commands
/login → register user
/getdata → fetch ESIOS data
/help → list commands
AWS Lambda Deployment
Create Lambda function with Node.js 22.x.

Use lambdaFunction.ts as handler.

Configure API Gateway HTTP endpoint.

Set Telegram webhook:

https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<LAMBDA_URL>
Check webhook status:
npm run check-webhook

⚠️ Notes
In-memory cache exists only while the Node.js process runs.

Use PostgreSQL for long-term caching.

Ensure Telegram token and ESIOS API_KEY are valid.
