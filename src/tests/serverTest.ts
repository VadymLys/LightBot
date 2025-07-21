import express from "express";
import { ResponseHandler } from "../handlers/responseHandler.js";
import { ApiError } from "../errors/ApiError.js";
import { SendResponseExpress } from "../utils/sendResponse.js";
import { checkApiKey } from "../utils/checkApiKey.js";
import { handlerCore } from "../handlers/handleCore.js";
import { APIGatewayProxyEvent } from "aws-lambda";
const app = express();
app.use(express.json());

app.get("/indicators", checkApiKey, async (req, res) => {
  try {
    const result = await handlerCore({} as APIGatewayProxyEvent);

    const data = JSON.parse(result.body);

    res.status(result.statusCode).json(data);
  } catch (err) {
    if (err instanceof Error) {
      SendResponseExpress.error(res, 500, err.message);
    } else {
      SendResponseExpress.error(res, 500, "Unknown error occurred");
    }
  }
});

export default app;
