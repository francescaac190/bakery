import type { Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import {
  listOrdersQuerySchema,
  orderIdParamsSchema,
  updateOrderStatusBodySchema,
  updateAdminNotesBodySchema,
} from "./adminOrders.schemas";
import { adminOrdersService } from "./adminOrders.service";

async function listOrders(req: Request, res: Response) {
  const query = listOrdersQuerySchema.parse(req.query);
  const result = await adminOrdersService.listOrders(query);
  return sendSuccess(res, result);
}

async function getOrderById(req: Request, res: Response) {
  const params = orderIdParamsSchema.parse(req.params);
  const order = await adminOrdersService.getOrderById(params.id);
  return sendSuccess(res, order);
}

async function updateOrderStatus(req: Request, res: Response) {
  const params = orderIdParamsSchema.parse(req.params);
  const body = updateOrderStatusBodySchema.parse(req.body);
  const changedBy = req.admin!.id;
  const result = await adminOrdersService.updateOrderStatus(
    params.id,
    body.status,
    changedBy,
  );
  return sendSuccess(res, result);
}

async function updateAdminNotes(req: Request, res: Response) {
  const params = orderIdParamsSchema.parse(req.params);
  const body = updateAdminNotesBodySchema.parse(req.body);
  const result = await adminOrdersService.updateAdminNotes(
    params.id,
    body.adminNotes,
  );
  return sendSuccess(res, result);
}

async function deleteOrder(req: Request, res: Response) {
  const params = orderIdParamsSchema.parse(req.params);
  await adminOrdersService.deleteOrder(params.id);
  res.status(204).send();
}

export const adminOrdersController = {
  listOrders,
  getOrderById,
  updateOrderStatus,
  updateAdminNotes,
  deleteOrder,
};
