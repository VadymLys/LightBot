import { Response } from "express";

export class SendResponseExpress {
  static success<T>(
    res: Response,
    resObject: { statusCode?: number; body?: T }
  ) {
    const statusCode = resObject.statusCode ?? 200;
    const body = resObject.body ?? {};

    res.status(statusCode).json(body);
  }

  static error(
    res: Response,
    resObject: { statusCode?: number; body: string }
  ) {
    const statusCode = resObject.statusCode || 500;
    const body = resObject.body ?? "{}";

    try {
      const parsed = JSON.parse(body);
      res.status(statusCode).json(parsed);
    } catch {
      res.status(statusCode).send(body);
    }
  }
}
