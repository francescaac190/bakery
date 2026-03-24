"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOrdersController = void 0;
const response_1 = require("../../shared/http/response");
const adminOrders_schemas_1 = require("./adminOrders.schemas");
const adminOrders_service_1 = require("./adminOrders.service");
async function listOrders(req, res) {
    const query = adminOrders_schemas_1.listOrdersQuerySchema.parse(req.query);
    const result = await adminOrders_service_1.adminOrdersService.listOrders(query);
    return (0, response_1.sendSuccess)(res, result);
}
async function updateOrderStatus(req, res) {
    const params = adminOrders_schemas_1.updateOrderStatusParamsSchema.parse(req.params);
    const body = adminOrders_schemas_1.updateOrderStatusBodySchema.parse(req.body);
    const order = await adminOrders_service_1.adminOrdersService.updateOrderStatus(params.id, body.status);
    return (0, response_1.sendSuccess)(res, order);
}
exports.adminOrdersController = {
    listOrders,
    updateOrderStatus,
};
//# sourceMappingURL=adminOrders.controller.js.map