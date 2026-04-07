import type { Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import { loginSchema } from "./auth.schemas";
import { authService } from "./auth.service";

async function login(req: Request, res: Response) {
  const body = loginSchema.parse(req.body);
  const result = await authService.login(body.email, body.password);
  return sendSuccess(res, result);
}

export const authController = { login };
