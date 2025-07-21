import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { bot } from "./TelegramBot.js";
import type { Update } from "grammy/types";
import { registerHandlers } from "./RegisterHandlers.js";
import { ResponseHandler } from "../../handlers/responseHandler.js";

registerHandlers();

export const lambdaFunction: APIGatewayProxyHandlerV2 = async (event) => {
  console.log("📥 Incoming event:", event.body);

  try {
    await bot.init();

    if (!event.body) {
      return ResponseHandler.error("No body in the request");
    }

    console.log("DB_URL", process.env.DB_URL);

    const update = JSON.parse(event.body || "{}") as Update;

    await bot.handleUpdate(update);

    return ResponseHandler.success(update);
  } catch (err) {
    return ResponseHandler.fromError(err);
  }
};
