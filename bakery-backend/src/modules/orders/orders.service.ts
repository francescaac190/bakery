import { AppError } from "../../shared/errors/app-error";
import { calculateTotalCents } from "../../shared/utils/money";
import { ordersRepository } from "./orders.repository";
import type { CreateOrderInput, CreateOrderResult } from "./orders.types";

async function createOrder(
  input: CreateOrderInput,
  inspirationImageUrl?: string,
): Promise<CreateOrderResult> {
  const productIds = [...new Set(input.items.map((item) => item.productId))];

  // Only look up products if there are items
  const pricedItems = [];
  if (productIds.length > 0) {
    const products = (await ordersRepository.findActiveProductsByIds(productIds)) as Array<{
      id: string;
      priceCents: number;
      currency: string;
    }>;
    const productsById = new Map(products.map((product) => [product.id, product]));

    for (const item of input.items) {
      const product = productsById.get(item.productId);
      if (!product) {
        throw new AppError(409, `Product not found or inactive: ${item.productId}`);
      }
      pricedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        notes: item.notes,
        unitPriceCents: product.priceCents,
        currency: product.currency,
      });
    }
  }

  const totalCents = calculateTotalCents(pricedItems);

  // Merge imageUrl into customCake if provided
  const customCakeWithImage =
    input.customCake && inspirationImageUrl
      ? { ...input.customCake, inspirationImage: inspirationImageUrl }
      : input.customCake;

  const order = await ordersRepository.createOrderWithItems({
    ...input,
    items: pricedItems,
    totalCents,
    customCake: customCakeWithImage,
  });

  return {
    orderId: order.id,
    displayId: (order as any).displayId,
    status: order.status,
    totalCents: order.totalCents,
    estimatedReadyAt: order.pickupAt,
    inspirationImageUrl,
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
