import { AppError } from "../../shared/errors/app-error";
import { parsePagination } from "../../shared/utils/pagination";
import { adminOrdersRepository } from "./adminOrders.repository";
const allowedStatusTransitions = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["IN_PROGRESS", "CANCELLED"],
    IN_PROGRESS: ["READY", "CANCELLED"],
    READY: ["COMPLETED", "CANCELLED"],
    COMPLETED: [],
    CANCELLED: [],
};
async function listOrders(input) {
    const { page, pageSize, skip, take } = parsePagination(input.page, input.pageSize);
    const { items, total } = await adminOrdersRepository.listOrders({
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
    const existingOrder = await adminOrdersRepository.findOrderById(orderId);
    if (!existingOrder) {
        throw new AppError(404, "Order not found");
    }
    const currentStatus = existingOrder.status;
    const allowed = allowedStatusTransitions[currentStatus];
    if (!allowed.includes(status) && currentStatus !== status) {
        throw new AppError(409, `Invalid status transition from ${currentStatus} to ${status}`);
    }
    return adminOrdersRepository.updateOrderStatus(orderId, status);
}
export const adminOrdersService = {
    listOrders,
    updateOrderStatus,
};
//# sourceMappingURL=adminOrders.service.js.map