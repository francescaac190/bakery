import { AppError } from "../../shared/errors/app-error";
import { calculateTotalCents } from "../../shared/utils/money";
import { ordersRepository } from "./orders.repository";
import type { CreateOrderInput, CreateOrderResult } from "./orders.types";

async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const productIds = [...new Set(input.items.map((item) => item.productId))];
  const products = (await ordersRepository.findActiveProductsByIds(productIds)) as Array<{
    id: string;
    priceCents: number;
    currency: string;
  }>;
  const productsById = new Map(products.map((product) => [product.id, product]));

  const pricedItems = input.items.map((item) => {
    const product = productsById.get(item.productId);
    if (!product) {
      throw new AppError(409, `Product not found or inactive: ${item.productId}`);
    }
    return {
      productId: item.productId,
      quantity: item.quantity,
      notes: item.notes,
      unitPriceCents: product.priceCents,
      currency: product.currency,
    };
  });

  const totalCents = calculateTotalCents(pricedItems);

  const order = await ordersRepository.createOrderWithItems({
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

async function getOrderById(orderId: string) {
  const order = await ordersRepository.findOrderById(orderId);
  if (!order) {
    throw new AppError(404, "Order not found");
  }
  return order;
}

export const ordersService = {
  createOrder,
  getOrderById,
};
