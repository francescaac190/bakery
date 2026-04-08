import type { Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import { dashboardService } from "./dashboard.service";

async function getSummary(_req: Request, res: Response) {
  const summary = await dashboardService.getSummary();
  return sendSuccess(res, summary);
}

export const dashboardController = { getSummary };
