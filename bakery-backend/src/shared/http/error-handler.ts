import type { NextFunction, Request, Response } from "express";
import multer from "multer";
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
    return sendError(res, "Validation error", 400, err.issues);
  }

  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.details);
  }

  if (err instanceof multer.MulterError) {
    const message = err.code === "LIMIT_FILE_SIZE"
      ? "File too large. Maximum size is 10 MB."
      : `Upload error: ${err.message}`;
    return sendError(res, message, 400);
  }

  if (err instanceof Error && err.message === "Only image files are allowed") {
    return sendError(res, err.message, 400);
  }

  return sendError(res, "Internal server error", 500);
}
