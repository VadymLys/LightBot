import { APIGatewayProxyResult } from "aws-lambda";
import { ApiError } from "../errors/ApiError.js";
import { isHttpResponse } from "../utils/isHttpResponse.js";

export class ResponseHandler {
  static success<T>(data: T, statusCode = 200): APIGatewayProxyResult {
    if (isHttpResponse(data)) {
      return data as APIGatewayProxyResult;
    }

    return {
      statusCode,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, data }),
    };
  }

  static error(message: string, statusCode = 500): APIGatewayProxyResult {
    return {
      statusCode,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, error: message }),
    };
  }

  static fromError(error: unknown): APIGatewayProxyResult {
    if (error instanceof ApiError) {
      return this.error(error.message, error.statusCode);
    }
    return this.error("Internal server error", 500);
  }
}
