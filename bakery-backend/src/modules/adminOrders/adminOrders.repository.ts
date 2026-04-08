import { prisma } from "../../db/prisma";

type OrderStatus =
  | "PENDING"
  | "APPROVED"
  | "IN_PROGRESS"
  | "READY"
  | "DELIVERED"
  | "PICKED_UP"
  | "CANCELLED";

type ListOrdersFilters = {
  status?: OrderStatus;
  from?: string;
  to?: string;
  search?: string;
  skip: number;
  take: number;
};

async function listOrders(filters: ListOrdersFilters) {
  const where: any = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.from || filters.to) {
    where.createdAt = {
      ...(filters.from ? { gte: new Date(filters.from) } : {}),
      ...(filters.to ? { lte: new Date(filters.to) } : {}),
    };
  }

  if (filters.search) {
    const term = filters.search.trim();
    where.OR = [
      { customerName: { contains: term, mode: "insensitive" } },
      { customerPhone: { contains: term, mode: "insensitive" } },
      { displayId: { contains: term, mode: "insensitive" } },
    ];
  }

  const [items, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      include: {
        items: { include: { product: { select: { name: true } } } },
        customCakeRequest: { select: { id: true } },
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
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, imageUrl: true } },
        },
      },
      customCakeRequest: true,
      statusLogs: { orderBy: { createdAt: "asc" } },
    },
  } as any);
}

async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  changedBy: string,
) {
  return prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: { status },
    }),
    (prisma as any).orderStatusLog.create({
      data: { orderId, status, changedBy },
    }),
  ]);
}

async function updateAdminNotes(orderId: string, adminNotes: string | null) {
  return prisma.order.update({
    where: { id: orderId },
    data: { adminNotes },
  });
}

async function deleteOrder(orderId: string) {
  return prisma.order.delete({ where: { id: orderId } });
}

export const adminOrdersRepository = {
  listOrders,
  findOrderById,
  updateOrderStatus,
  updateAdminNotes,
  deleteOrder,
};
