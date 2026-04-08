import { prisma } from "../../db/prisma";
import { generateDisplayId } from "../../shared/utils/displayId";
import type { CreateOrderInput } from "./orders.types";

type CreateOrderWithPricesInput = Omit<CreateOrderInput, "items"> & {
  items: Array<{
    productId: string;
    quantity: number;
    notes?: string;
    unitPriceCents: number;
    currency: string;
    variantId?: string;
    variantLabel?: string;
  }>;
  totalCents: number;
};

async function findActiveProductsByIds(productIds: string[]) {
  if (productIds.length === 0) {
    return [];
  }

  return prisma.product.findMany({
    where: {
      id: { in: productIds },
      isActive: true,
    },
    include: {
      variants: { where: { isActive: true } },
    },
  });
}

async function createOrderWithItems(input: CreateOrderWithPricesInput) {
  return prisma.$transaction(async (tx: any) => {
    const displayId = await generateDisplayId(tx);

    const order = await tx.order.create({
      data: {
        displayId,
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

    await tx.orderStatusLog.create({
      data: {
        orderId: order.id,
        status: "PENDING",
        changedBy: null,
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
          variantId: item.variantId ?? null,
          variantLabel: item.variantLabel ?? null,
        })),
      });
    }

    if (input.customCake) {
      await (tx as any).customCakeRequest.create({
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
        statusLogs: { orderBy: { createdAt: "asc" } },
      },
    } as any);
  });
}

async function findOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      customCakeRequest: true,
      statusLogs: { orderBy: { createdAt: "asc" } },
    },
  } as any);
}

export const ordersRepository = {
  findActiveProductsByIds,
  createOrderWithItems,
  findOrderById,
};
