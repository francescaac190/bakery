import type { Response } from "express";

export function sendSuccess<T>(res: Response, data: T, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    error: null,
  });
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  details?: unknown,
) {
  return res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      message,
      details: details ?? null,
    },
  });
}
