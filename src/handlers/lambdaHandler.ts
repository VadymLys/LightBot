import { APIGatewayProxyHandler } from "aws-lambda";
import { handlerCore } from "./handleCore.js";

export const lambdaHandler: APIGatewayProxyHandler = async (event) => {
  const result = await handlerCore(event);
  return result;
};
