"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersService = void 0;
const app_error_1 = require("../../shared/errors/app-error");
const money_1 = require("../../shared/utils/money");
const orders_repository_1 = require("./orders.repository");
async function createOrder(input) {
    const productIds = [...new Set(input.items.map((item) => item.productId))];
    const products = (await orders_repository_1.ordersRepository.findActiveProductsByIds(productIds));
    const productsById = new Map(products.map((product) => [product.id, product]));
    const pricedItems = input.items.map((item) => {
        const product = productsById.get(item.productId);
        if (!product) {
            throw new app_error_1.AppError(409, `Product not found or inactive: ${item.productId}`);
        }
        return {
            productId: item.productId,
            quantity: item.quantity,
            notes: item.notes,
            unitPriceCents: product.priceCents,
            currency: product.currency,
        };
    });
    const totalCents = (0, money_1.calculateTotalCents)(pricedItems);
    const order = await orders_repository_1.ordersRepository.createOrderWithItems({
        ...input,
        items: pricedItems,
        totalCents,
    });
    return {
        orderId: order.id,
        status: order.status,
        totalCents: order.totalCents,
        estimatedReadyAt: order.pickupAt,
    };
}
async function getOrderById(orderId) {
    const order = await orders_repository_1.ordersRepository.findOrderById(orderId);
    if (!order) {
        throw new app_error_1.AppError(404, "Order not found");
    }
    return order;
}
exports.ordersService = {
    createOrder,
    getOrderById,
};
//# sourceMappingURL=orders.service.js.map