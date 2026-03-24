"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOrdersService = void 0;
const app_error_1 = require("../../shared/errors/app-error");
const pagination_1 = require("../../shared/utils/pagination");
const adminOrders_repository_1 = require("./adminOrders.repository");
const allowedStatusTransitions = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["IN_PROGRESS", "CANCELLED"],
    IN_PROGRESS: ["READY", "CANCELLED"],
    READY: ["COMPLETED", "CANCELLED"],
    COMPLETED: [],
    CANCELLED: [],
};
async function listOrders(input) {
    const { page, pageSize, skip, take } = (0, pagination_1.parsePagination)(input.page, input.pageSize);
    const { items, total } = await adminOrders_repository_1.adminOrdersRepository.listOrders({
        status: input.status,
        from: input.from,
        to: input.to,
        skip,
        take,
    });
    return {
        items,
        pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        },
    };
}
async function updateOrderStatus(orderId, status) {
    const existingOrder = await adminOrders_repository_1.adminOrdersRepository.findOrderById(orderId);
    if (!existingOrder) {
        throw new app_error_1.AppError(404, "Order not found");
    }
    const currentStatus = existingOrder.status;
    const allowed = allowedStatusTransitions[currentStatus];
    if (!allowed.includes(status) && currentStatus !== status) {
        throw new app_error_1.AppError(409, `Invalid status transition from ${currentStatus} to ${status}`);
    }
    return adminOrders_repository_1.adminOrdersRepository.updateOrderStatus(orderId, status);
}
exports.adminOrdersService = {
    listOrders,
    updateOrderStatus,
};
//# sourceMappingURL=adminOrders.service.js.map