import fs from "fs";
import { esiosApi } from "./Api/esiosGetApi.js";
import dotenv from "dotenv";
import { ResponseHandler } from "./handlers/responseHandler.js";
import { formatIndicatorMessage } from "./utils/formatIndicatorMessage.js";

dotenv.config();

const logPath: string =
  "C:\\Users\\User\\Documents\\Programacion\\power-logs.txt";

async function main(): Promise<void> {
  try {
    const data = await esiosApi.indicators(1001);
    const message = formatIndicatorMessage(data);
    fs.appendFileSync(logPath, message.join("\n") + "\n");
    ResponseHandler.success(message);
  } catch (err: unknown) {
    let errorMessage: string;

    if (err instanceof Error) {
      errorMessage = `[${new Date().toISOString()}] ❌ Помилка: ${
        err.message
      }\n`;
    } else {
      errorMessage = `[${new Date().toISOString()}] ❌ Помилка: ${String(
        err
      )}\n`;
    }
    ResponseHandler.error(errorMessage);
  }
}

main();
