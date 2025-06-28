import { Request, Response, NextFunction } from "express";

export const checkApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    !req.headers["x-api-key"] ||
    req.headers["x-api-key"] !== process.env.API_KEY
  ) {
    res.status(401).send("Unauthorized");
    return;
  }
  next();
};
