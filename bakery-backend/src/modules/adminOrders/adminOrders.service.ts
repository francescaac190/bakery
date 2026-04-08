type OrderStatus =
  | "PENDING"
  | "APPROVED"
  | "IN_PROGRESS"
  | "READY"
  | "DELIVERED"
  | "PICKED_UP"
  | "CANCELLED";

import { AppError } from "../../shared/errors/app-error";
import { parsePagination } from "../../shared/utils/pagination";
import { adminOrdersRepository } from "./adminOrders.repository";

type ListOrdersInput = {
  status?: OrderStatus;
  from?: string;
  to?: string;
  search?: string;
  page?: string;
  pageSize?: string;
};

const allowedStatusTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["APPROVED", "CANCELLED"],
  APPROVED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["READY", "CANCELLED"],
  READY: ["DELIVERED", "PICKED_UP", "CANCELLED"],
  DELIVERED: [],
  PICKED_UP: [],
  CANCELLED: [],
};

async function listOrders(input: ListOrdersInput) {
  const { page, pageSize, skip, take } = parsePagination(
    input.page,
    input.pageSize,
  );
  const { items, total } = await adminOrdersRepository.listOrders({
    status: input.status,
    from: input.from,
    to: input.to,
    search: input.search,
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

async function getOrderById(orderId: string) {
  const order = await adminOrdersRepository.findOrderById(orderId);
  if (!order) {
    throw new AppError(404, "Order not found");
  }
  return order;
}

async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  changedBy: string,
) {
  const existingOrder = await adminOrdersRepository.findOrderById(orderId);
  if (!existingOrder) {
    throw new AppError(404, "Order not found");
  }

  const currentStatus = existingOrder.status as OrderStatus;
  const allowed = allowedStatusTransitions[currentStatus];
  if (!allowed.includes(status) && currentStatus !== status) {
    throw new AppError(
      409,
      `Invalid status transition from ${currentStatus} to ${status}`,
    );
  }

  if (status === "DELIVERED" && existingOrder.fulfillmentType !== "DELIVERY") {
    throw new AppError(
      409,
      "Cannot mark as DELIVERED — order fulfillment type is PICKUP",
    );
  }
  if (status === "PICKED_UP" && existingOrder.fulfillmentType !== "PICKUP") {
    throw new AppError(
      409,
      "Cannot mark as PICKED_UP — order fulfillment type is DELIVERY",
    );
  }

  return adminOrdersRepository.updateOrderStatus(orderId, status, changedBy);
}

async function updateAdminNotes(orderId: string, adminNotes: string | null) {
  const existingOrder = await adminOrdersRepository.findOrderById(orderId);
  if (!existingOrder) {
    throw new AppError(404, "Order not found");
  }
  return adminOrdersRepository.updateAdminNotes(orderId, adminNotes);
}

async function setCustomCakePrice(
  orderId: string,
  priceCents: number,
  pricedBy: string,
) {
  const order = await adminOrdersRepository.findOrderById(orderId);
  if (!order) {
    throw new AppError(404, "Order not found");
  }
  const customCake = (order as any).customCakeRequest;
  if (!customCake) {
    throw new AppError(409, "Order does not have a custom cake request");
  }

  const itemsTotal = ((order as any).items ?? []).reduce(
    (sum: number, item: any) => sum + item.quantity * item.unitPriceCents,
    0,
  );
  const newTotalCents = itemsTotal + priceCents;

  await adminOrdersRepository.setCustomCakePrice(
    orderId,
    priceCents,
    pricedBy,
    newTotalCents,
  );

  return { orderId, finalPriceCents: priceCents, totalCents: newTotalCents };
}

async function deleteOrder(orderId: string) {
  const existing = await adminOrdersRepository.findOrderById(orderId);
  if (!existing) {
    throw new AppError(404, "Order not found");
  }
  await adminOrdersRepository.deleteOrder(orderId);
}

export const adminOrdersService = {
  listOrders,
  getOrderById,
  updateOrderStatus,
  updateAdminNotes,
  setCustomCakePrice,
  deleteOrder,
};
