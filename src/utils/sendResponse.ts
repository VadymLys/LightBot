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

  static error(res: Response, statusCode: number, message: string) {
    res.status(statusCode).json({
      success: false,
      error: message,
    });
  }
}
