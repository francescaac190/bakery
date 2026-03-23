import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error";
import { sendError } from "./response";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    return sendError(res, "Validation error", 400, err.flatten());
  }

  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.details);
  }

  return sendError(res, "Internal server error", 500);
}
