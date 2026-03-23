import { sendSuccess } from "../../shared/http/response";
import { listOrdersQuerySchema, updateOrderStatusBodySchema, updateOrderStatusParamsSchema, } from "./adminOrders.schemas";
import { adminOrdersService } from "./adminOrders.service";
async function listOrders(req, res) {
    const query = listOrdersQuerySchema.parse(req.query);
    const result = await adminOrdersService.listOrders(query);
    return sendSuccess(res, result);
}
async function updateOrderStatus(req, res) {
    const params = updateOrderStatusParamsSchema.parse(req.params);
    const body = updateOrderStatusBodySchema.parse(req.body);
    const order = await adminOrdersService.updateOrderStatus(params.id, body.status);
    return sendSuccess(res, order);
}
export const adminOrdersController = {
    listOrders,
    updateOrderStatus,
};
//# sourceMappingURL=adminOrders.controller.js.map