import { Request, Response, NextFunction } from "express";
import { logger } from "./logger.js";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode, message } = err as any;

  if (!(err instanceof ApiError)) {
    statusCode = 500;
    message = "Internal Server Error";
  }

  logger.error(`${statusCode} - ${err.message} - ${req.method} ${req.originalUrl} - ${req.ip}`);
  if (err.stack) {
    console.error("FULL ERROR STACK:", err.stack);
  }

  res.status(statusCode).json({
    ok: false,
    status: statusCode,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
