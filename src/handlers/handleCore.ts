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
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

export const handlerCore = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
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
