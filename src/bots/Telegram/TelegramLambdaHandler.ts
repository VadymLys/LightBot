import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { bot } from "./TelegramBot.js";
import type { Update } from "grammy/types";
import { registerHandlers } from "./RegisterHandlers.js";
import { isAuthorized } from "../../utils/isAuthorized.js";

registerHandlers();

export const lambdaFunction: APIGatewayProxyHandlerV2 = async (event) => {
  console.log("📥 Incoming event:", event.body);

  if (!isAuthorized(event)) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  await bot.init();

  if (process.env.LOCAL_DEV === "true") {
    bot.start();
  }

  try {
    const update = JSON.parse(event.body || "{}") as Update;

    await bot.handleUpdate(update);

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "ok" }),
    };
  } catch (err) {
    console.error("Telegram Lambda error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
