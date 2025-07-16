import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../handlers/responseHandler.js";

export const checkApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    !req.headers["x-api-key"] ||
    req.headers["x-api-key"] !== process.env.API_KEY
  ) {
    const errorResponse = ResponseHandler.error("Unauthorized", 401);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
    return;
  }
  next();
};
