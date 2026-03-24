"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOrdersRouter = void 0;
const express_1 = require("express");
const adminOrders_controller_1 = require("./adminOrders.controller");
exports.adminOrdersRouter = (0, express_1.Router)();
exports.adminOrdersRouter.get("/orders", adminOrders_controller_1.adminOrdersController.listOrders);
exports.adminOrdersRouter.patch("/orders/:id/status", adminOrders_controller_1.adminOrdersController.updateOrderStatus);
//# sourceMappingURL=adminOrders.routes.js.map