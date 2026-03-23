type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";
import { AppError } from "../../shared/errors/app-error";
import { parsePagination } from "../../shared/utils/pagination";
import { adminOrdersRepository } from "./adminOrders.repository";

type ListOrdersInput = {
  status?: OrderStatus;
  from?: string;
  to?: string;
  page?: string;
  pageSize?: string;
};

const allowedStatusTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["READY", "CANCELLED"],
  READY: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

async function listOrders(input: ListOrdersInput) {
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

async function updateOrderStatus(orderId: string, status: OrderStatus) {
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

  return adminOrdersRepository.updateOrderStatus(orderId, status);
}

export const adminOrdersService = {
  listOrders,
  updateOrderStatus,
};
