import { Router } from "express";
import { requireRole } from "../../shared/middleware/requireRole";
import { adminOrdersController } from "./adminOrders.controller";

export const adminOrdersRouter = Router();

adminOrdersRouter.get("/", adminOrdersController.listOrders);
adminOrdersRouter.patch("/:id/status", adminOrdersController.updateOrderStatus);
adminOrdersRouter.delete("/:id", requireRole("SUPER_ADMIN"), adminOrdersController.deleteOrder);
