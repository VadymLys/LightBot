import { APIGatewayProxyResult } from "aws-lambda";

export const isHttpResponse = (data: unknown): data is APIGatewayProxyResult =>
  typeof data === "object" &&
  data !== null &&
  "statusCode" in data &&
  typeof (data as any).statusCode === "number" &&
  "headers" in data &&
  typeof (data as any).headers === "object" &&
  "body" in data &&
  typeof (data as any).body === "string";
