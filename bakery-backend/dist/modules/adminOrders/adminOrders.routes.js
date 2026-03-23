import { Router } from "express";
import { adminOrdersController } from "./adminOrders.controller";
export const adminOrdersRouter = Router();
adminOrdersRouter.get("/orders", adminOrdersController.listOrders);
adminOrdersRouter.patch("/orders/:id/status", adminOrdersController.updateOrderStatus);
//# sourceMappingURL=adminOrders.routes.js.map