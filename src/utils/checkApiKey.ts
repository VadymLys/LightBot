import { Request, Response, NextFunction } from "express";
import { SendResponseExpress } from "../utils/sendResponse.js";

export const checkApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    !req.headers["x-api-key"] ||
    req.headers["x-api-key"] !== process.env.API_KEY
  ) {
    const errorResponse = SendResponseExpress.error(res, 401, "Unauthorized");
    return;
  }
  next();
};
