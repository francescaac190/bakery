import type { Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import { createOrderSchema, orderIdParamsSchema } from "./orders.schemas";
import { ordersService } from "./orders.service";

async function createOrder(req: Request, res: Response) {
  const body = createOrderSchema.parse(req.body);
  const order = await ordersService.createOrder(body);
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
