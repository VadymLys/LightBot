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
    const status = err instanceof ApiError ? err.statusCode : 500;
    const errorResponse = ResponseHandler.fromError(status);
    SendResponseExpress.error(res, errorResponse);
  }
});

export default app;
