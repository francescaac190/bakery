"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const env_1 = require("../config/env");
const adminOrders_routes_1 = require("../modules/adminOrders/adminOrders.routes");
const menu_routes_1 = require("../modules/menu/menu.routes");
const orders_routes_1 = require("../modules/orders/orders.routes");
exports.apiRouter = (0, express_1.Router)();
exports.apiRouter.use(`${env_1.env.apiPrefix}/menu`, menu_routes_1.menuRouter);
exports.apiRouter.use(`${env_1.env.apiPrefix}/orders`, orders_routes_1.ordersRouter);
exports.apiRouter.use(`${env_1.env.apiPrefix}/admin`, adminOrders_routes_1.adminOrdersRouter);
//# sourceMappingURL=index.js.map