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
import { cache } from "../utils/cache.js";

export const handlerCore = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const cacheKey = `esios_1001_${toISODate(today, {
      dateOnly: true,
    })}_${toISODate(tomorrow, { dateOnly: true })}`;

    const values = await cache.remember(cacheKey, 300, async () => {
      console.log("📊 API values:", JSON.stringify(values, null, 2));

      return await esiosApi.indicators(1001, {
        start_date: toISODate(today),
        end_date: toISODate(tomorrow),
        geo_agg: "sum",
        time_trunc: "hour",
      });
    });

    if (!values?.indicator?.values?.length) {
      return ResponseHandler.success("⚠️ No data available for this period.");
    }

    const handleMessage = formatIndicatorMessage(values);
    return ResponseHandler.success(handleMessage);
  } catch (err) {
    const status = err instanceof ApiError ? err.statusCode : 500;
    return ResponseHandler.fromError(status);
  }
};
