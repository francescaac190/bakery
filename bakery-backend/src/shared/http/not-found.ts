import type { Request, Response } from "express";
import { sendError } from "./response";

export function notFoundHandler(req: Request, res: Response) {
  return sendError(
    res,
    `Route not found: ${req.method} ${req.originalUrl}`,
    404,
  );
}
