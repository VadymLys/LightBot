import { handlerCore } from "./handlers/handleCore.js";
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

  const response = (await handlerCore(
    mockEvent as any
  )) as APIGatewayProxyResult;

  console.log("Response:", response);
};

main();
