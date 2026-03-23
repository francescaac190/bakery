import { prisma } from "../../db/prisma";
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
    const [items, total] = await prisma.$transaction([
        prisma.order.findMany({
            where,
            include: {
                items: true,
            },
            orderBy: { createdAt: "desc" },
            skip: filters.skip,
            take: filters.take,
        }),
        prisma.order.count({ where }),
    ]);
    return { items, total };
}
async function findOrderById(orderId) {
    return prisma.order.findUnique({
        where: { id: orderId },
    });
}
async function updateOrderStatus(orderId, status) {
    return prisma.order.update({
        where: { id: orderId },
        data: {
            status,
        },
    });
}
export const adminOrdersRepository = {
    listOrders,
    findOrderById,
    updateOrderStatus,
};
//# sourceMappingURL=adminOrders.repository.js.map