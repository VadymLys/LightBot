import express from "express";
import { ResponseHandler } from "./handlers/responseHandler.js";
import { ApiError } from "./errors/ApiError.js";
import { SendResponseExpress } from "./utils/sendResponse.js";
import { checkApiKey } from "./utils/checkApiKey.js";
import { handlerCore } from "./handlers/handleCore.js";
import { APIGatewayProxyEvent } from "aws-lambda";
import dotenv from "dotenv";
import { generateAccessTokenTelegram } from "./handlers/jwthandler.js";
import { authHandler } from "./handlers/authHandler.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/indicators", checkApiKey, async (req, res) => {
  try {
    const result = await handlerCore({} as APIGatewayProxyEvent);

    const data = JSON.parse(result.body);

    res.status(result.statusCode).json(data);
  } catch (err) {
    const status = err instanceof ApiError ? err.statusCode : 500;
    SendResponseExpress.error(res, 500, "Internal server error");
  }
});

app.post("/login", checkApiKey, async (req, res) => {
  const telegramData = req.body;

  if (!authHandler(telegramData)) {
    ResponseHandler.error(telegramData);
  }

  const token = generateAccessTokenTelegram(
    telegramData.id,
    telegramData.username
  );

  res.json({ token });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app;
