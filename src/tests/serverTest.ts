import express from "express";
import { SendResponseExpress } from "../utils/sendResponse.js";
import { checkApiKey } from "../utils/checkApiKey.js";
import { handlerCore } from "../handlers/handleCore.js";
import { APIGatewayProxyEventV2 } from "aws-lambda";
const app = express();
app.use(express.json());

app.get("/indicators", checkApiKey, async (req, res) => {
  try {
    const result = (await handlerCore({} as APIGatewayProxyEventV2)) as {
      body: string;
      statusCode: number;
    };
    console.log("🚀 ~ result ~ result:", result);

    const data = JSON.parse(result.body);
    console.log("🚀 ~ app.get ~ data :", data);

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
