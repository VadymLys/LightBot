import { esiosApi } from "../Api/esiosGetApi.js";
import { ResponseHandler } from "./responseHandler.js";
import { ApiError } from "../errors/ApiError.js";
import {
  yesterday,
  today,
  tomorrow,
  toISODate,
} from "../utils/DateConverter.js";
import { formatIndicatorMessage } from "../utils/formatIndicatorMessage.js";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handlerCore = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const values = await esiosApi.indicators(1001, {
      start_date: toISODate(today),
      end_date: toISODate(tomorrow),
      geo_agg: "sum",
      time_trunc: "hour",
    });
    const handleMessage = formatIndicatorMessage(values);
    return ResponseHandler.success(handleMessage);
  } catch (err) {
    const status = err instanceof ApiError ? err.statusCode : 500;
    return ResponseHandler.fromError(status);
  }
};
