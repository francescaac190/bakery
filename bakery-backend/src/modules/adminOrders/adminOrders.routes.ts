import { Router } from "express";
import { requireRole } from "../../shared/middleware/requireRole";
import { adminOrdersController } from "./adminOrders.controller";

export const adminOrdersRouter = Router();

adminOrdersRouter.get("/", adminOrdersController.listOrders);
adminOrdersRouter.get("/:id", adminOrdersController.getOrderById);
adminOrdersRouter.patch("/:id/status", adminOrdersController.updateOrderStatus);
adminOrdersRouter.patch("/:id/notes", adminOrdersController.updateAdminNotes);
adminOrdersRouter.delete(
  "/:id",
  requireRole("SUPER_ADMIN"),
  adminOrdersController.deleteOrder,
);
