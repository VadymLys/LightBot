import express from "express";
import { ApiError } from "./errors/ApiError.js";
import { SendResponseExpress } from "./utils/sendResponse.js";
import { checkApiKey } from "./utils/checkApiKey.js";
import { handlerCore } from "./handlers/handleCore.js";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import dotenv from "dotenv";
import { generateAccessTokenTelegram } from "./handlers/jwthandler.js";
import { authHandler } from "./handlers/authHandler.js";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/42g9xosdhkxk2e5ec4oxf8g8p02c7y.html", (req, res) => {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, "42g9xosdhkxk2e5ec4oxf8g8p02c7y.html"));
});

app.get("/indicators", checkApiKey, async (req, res) => {
  try {
    const result = (await handlerCore({} as APIGatewayProxyEventV2)) as {
      body: string;
      statusCode: number;
    };

    const data = JSON.parse(result.body);

    res.status(result.statusCode).json(data);
  } catch (err) {
    const status = err instanceof ApiError ? err.statusCode : 500;
    SendResponseExpress.error(res, 500, "Internal server error");
  }
});

app.post("/login", checkApiKey, async (req, res) => {
  try {
    const telegramData = req.body;

    if (!authHandler(telegramData)) {
      return SendResponseExpress.error(res, 401, "Unauthorized");
    }

    const token = generateAccessTokenTelegram(
      telegramData.id,
      telegramData.username
    );

    res.json({ token });
  } catch (err) {
    SendResponseExpress.error(res, 400, "Error in login");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app;
