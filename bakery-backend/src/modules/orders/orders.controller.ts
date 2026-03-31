import type { Request, Response } from "express";
import { AppError } from "../../shared/errors/app-error";
import { sendSuccess } from "../../shared/http/response";
import { createOrderSchema, orderIdParamsSchema } from "./orders.schemas";
import { ordersService } from "./orders.service";

async function createOrder(req: Request, res: Response) {
  // Support both JSON body (legacy) and multipart/form-data
  let rawBody: unknown;
  if (req.body?.data) {
    try {
      rawBody = JSON.parse(req.body.data as string);
    } catch {
      throw new AppError(400, "Invalid JSON in 'data' field");
    }
  } else {
    rawBody = req.body;
  }

  const body = createOrderSchema.parse(rawBody);

  // Inject uploaded file URL into customCake if present
  let inspirationImageUrl: string | undefined;
  if (req.file) {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    inspirationImageUrl = `${baseUrl}/uploads/${req.file.filename}`;
  }

  const order = await ordersService.createOrder(body, inspirationImageUrl);
  return sendSuccess(res, order, 201);
}

async function getOrderById(req: Request, res: Response) {
  const params = orderIdParamsSchema.parse(req.params);
  const order = await ordersService.getOrderById(params.id);
  return sendSuccess(res, order);
}

export const ordersController = {
  createOrder,
  getOrderById,
};
