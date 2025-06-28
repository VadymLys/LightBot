import { lambdaHandler } from "./handlers/lambdaHandler.js";
import { today, tomorrow, toISODate } from "./utils/DateConverter.js";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const main = async () => {
  const mockEvent: Partial<APIGatewayProxyEvent> = {
    queryStringParameters: {
      id: "1001",
      start_date: toISODate(today),
      end_date: toISODate(tomorrow),
      geo_agg: "sum",
      time_trunc: "hour",
    },
  };

  const mockContext = {};
  const mockCallback = () => {};

  const response = (await lambdaHandler(
    mockEvent as any,
    mockContext as any,
    mockCallback
  )) as APIGatewayProxyResult;

  console.log("Response:", response);
};

main();
