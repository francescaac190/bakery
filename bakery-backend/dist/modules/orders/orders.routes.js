"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersRouter = void 0;
const express_1 = require("express");
const orders_controller_1 = require("./orders.controller");
exports.ordersRouter = (0, express_1.Router)();
exports.ordersRouter.post("/", orders_controller_1.ordersController.createOrder);
exports.ordersRouter.get("/:id", orders_controller_1.ordersController.getOrderById);
//# sourceMappingURL=orders.routes.js.map