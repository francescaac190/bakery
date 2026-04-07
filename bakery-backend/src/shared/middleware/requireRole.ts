import type { NextFunction, Request, Response } from "express";
import type { AdminRole } from "@prisma/client";
import { AppError } from "../errors/app-error";

export function requireRole(role: AdminRole) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.admin) {
      throw new AppError(401, "Not authenticated");
    }
    if (req.admin.role !== role) {
      throw new AppError(403, "Insufficient permissions");
    }
    next();
  };
}
