import { prisma } from "../../db/prisma";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

type ListOrdersFilters = {
  status?: OrderStatus;
  from?: string;
  to?: string;
  skip: number;
  take: number;
};

async function listOrders(filters: ListOrdersFilters) {
  const where: any = {
    status: filters.status,
    createdAt:
      filters.from || filters.to
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

async function findOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
  });
}

async function updateOrderStatus(orderId: string, status: OrderStatus) {
  return prisma.order.update({
    where: { id: orderId },
    data: {
      status,
    },
  });
}

async function deleteOrder(orderId: string) {
  return prisma.order.delete({ where: { id: orderId } });
}

export const adminOrdersRepository = {
  listOrders,
  findOrderById,
  updateOrderStatus,
  deleteOrder,
};
