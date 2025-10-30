import { esiosApi } from "../Api/esiosGetApi.js";
import { ResponseHandler } from "./responseHandler.js";
import { ApiError } from "../errors/ApiError.js";
import { today, tomorrow, toISODate } from "../utils/DateConverter.js";
import { formatIndicatorMessage } from "../utils/formatIndicatorMessage.js";
import { cache } from "../utils/cache.js";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

export const handlerCore = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const params = event.queryStringParameters || {};
    const id = params.id ? Number(params.id) : 1001;
    const start_date = params.start_date || toISODate(today);
    const end_date = params.end_date || toISODate(tomorrow);
    const geo_agg = params.geo_agg || "sum";
    const time_trunc = params.time_trunc || "hour";

    const cacheKey = `esios_${id}_${start_date}_${end_date}_${geo_agg}_${time_trunc}`;

    const values = await cache.remember(cacheKey, 300, async () => {
      const response = await esiosApi.indicators(id, {
        start_date,
        end_date,
        geo_agg,
        time_trunc,
      });
      return response;
    });

    console.log("💾 Cached values:", values);

    if (!values?.indicator?.values?.length) {
      console.warn("⚠️ No data in response");
      return ResponseHandler.success(["⚠️ No data available for this period."]);
    }

    const handleMessage = formatIndicatorMessage(values);
    console.log("📝 Formatted message:", handleMessage);

    return ResponseHandler.success(handleMessage);
  } catch (err) {
    console.error("💥 Error in handlerCore:", err);
    const status = err instanceof ApiError ? err.statusCode : 500;
    return ResponseHandler.fromError(status);
  }
};
