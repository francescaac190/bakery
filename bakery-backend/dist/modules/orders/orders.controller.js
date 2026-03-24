"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersController = void 0;
const response_1 = require("../../shared/http/response");
const orders_schemas_1 = require("./orders.schemas");
const orders_service_1 = require("./orders.service");
async function createOrder(req, res) {
    const body = orders_schemas_1.createOrderSchema.parse(req.body);
    const order = await orders_service_1.ordersService.createOrder(body);
    return (0, response_1.sendSuccess)(res, order, 201);
}
async function getOrderById(req, res) {
    const params = orders_schemas_1.orderIdParamsSchema.parse(req.params);
    const order = await orders_service_1.ordersService.getOrderById(params.id);
    return (0, response_1.sendSuccess)(res, order);
}
exports.ordersController = {
    createOrder,
    getOrderById,
};
//# sourceMappingURL=orders.controller.js.map