import { prisma } from "../../db/prisma";
async function findActiveProductsByIds(productIds) {
    if (productIds.length === 0) {
        return [];
    }
    return prisma.product.findMany({
        where: {
            id: { in: productIds },
            isActive: true,
        },
    });
}
async function createOrderWithItems(input) {
    return prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                fulfillmentType: input.fulfillmentType,
                customerName: input.customerName,
                customerPhone: input.customerPhone,
                customerEmail: input.customerEmail,
                pickupAt: input.pickupAt ? new Date(input.pickupAt) : null,
                deliveryAddress: input.deliveryAddress,
                notes: input.notes,
                totalCents: input.totalCents,
            },
        });
        if (input.items.length > 0) {
            await tx.orderItem.createMany({
                data: input.items.map((item) => ({
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPriceCents: item.unitPriceCents,
                    currency: item.currency,
                    notes: item.notes,
                })),
            });
        }
        if (input.customCake) {
            await tx.customCakeRequest.create({
                data: {
                    orderId: order.id,
                    eventDate: input.customCake.eventDate
                        ? new Date(input.customCake.eventDate)
                        : null,
                    servings: input.customCake.servings,
                    size: input.customCake.size,
                    flavor: input.customCake.flavor,
                    filling: input.customCake.filling,
                    frosting: input.customCake.frosting,
                    messageOnCake: input.customCake.messageOnCake,
                    designNotes: input.customCake.designNotes,
                    allergies: input.customCake.allergies,
                    inspirationImage: input.customCake.inspirationImage,
                    budgetCents: input.customCake.budgetCents,
                },
            });
        }
        return tx.order.findUniqueOrThrow({
            where: { id: order.id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customCakeRequest: true,
            },
        });
    });
}
async function findOrderById(orderId) {
    return prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            customCakeRequest: true,
        },
    });
}
export const ordersRepository = {
    findActiveProductsByIds,
    createOrderWithItems,
    findOrderById,
};
//# sourceMappingURL=orders.repository.js.map