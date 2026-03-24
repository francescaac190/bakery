"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOrdersRepository = void 0;
const prisma_1 = require("../../db/prisma");
async function listOrders(filters) {
    const where = {
        status: filters.status,
        createdAt: filters.from || filters.to
            ? {
                gte: filters.from ? new Date(filters.from) : undefined,
                lte: filters.to ? new Date(filters.to) : undefined,
            }
            : undefined,
    };
    const [items, total] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.order.findMany({
            where,
            include: {
                items: true,
            },
            orderBy: { createdAt: "desc" },
            skip: filters.skip,
            take: filters.take,
        }),
        prisma_1.prisma.order.count({ where }),
    ]);
    return { items, total };
}
async function findOrderById(orderId) {
    return prisma_1.prisma.order.findUnique({
        where: { id: orderId },
    });
}
async function updateOrderStatus(orderId, status) {
    return prisma_1.prisma.order.update({
        where: { id: orderId },
        data: {
            status,
        },
    });
}
exports.adminOrdersRepository = {
    listOrders,
    findOrderById,
    updateOrderStatus,
};
//# sourceMappingURL=adminOrders.repository.js.map