import { prisma } from "../../db/prisma";

async function getSummary() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );

  const [
    todayCount,
    pendingCount,
    inProgressCount,
    unpricedCakeCount,
    recentOrders,
  ] = await prisma.$transaction([
    prisma.order.count({
      where: { createdAt: { gte: startOfDay, lt: endOfDay } },
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "IN_PROGRESS" } }),
    (prisma as any).customCakeRequest.count({
      where: { finalPriceCents: null },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        displayId: true,
        customerName: true,
        status: true,
        totalCents: true,
        currency: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    todayCount,
    pendingCount,
    inProgressCount,
    unpricedCakeCount,
    recentOrders,
  };
}

export const dashboardService = { getSummary };
