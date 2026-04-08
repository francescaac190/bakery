import { z } from "zod";

const isoDateSchema = z
  .string()
  .datetime({ offset: true })
  .or(z.string().datetime());

const customCakeSchema = z.object({
  eventDate: isoDateSchema.optional(),
  servings: z.number().int().positive().optional(),
  size: z.string().trim().min(1).max(50).optional(),
  flavor: z.string().trim().min(1).max(100).optional(),
  filling: z.string().trim().min(1).max(100).optional(),
  frosting: z.string().trim().min(1).max(100).optional(),
  messageOnCake: z.string().trim().max(120).optional(),
  designNotes: z.string().trim().max(1000).optional(),
  allergies: z.string().trim().max(300).optional(),
  inspirationImage: z.string().url().optional(),
  budgetCents: z.number().int().nonnegative().optional(),
});

export const createOrderSchema = z
  .object({
    customerName: z.string().trim().min(2).max(120),
    customerPhone: z.string().trim().min(5).max(30),
    customerEmail: z.string().email().optional(),
    fulfillmentType: z.enum(["PICKUP", "DELIVERY"]),
    pickupAt: isoDateSchema.optional(),
    deliveryAddress: z.string().trim().min(5).max(300).optional(),
    notes: z.string().trim().max(1000).optional(),
    items: z
      .array(
        z.object({
          productId: z.string().trim().min(1),
          quantity: z.number().int().positive(),
          variantId: z.string().trim().min(1).optional(),
          notes: z.string().trim().max(300).optional(),
        }),
      )
      .default([]),
    customCake: customCakeSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.items.length === 0 && !data.customCake) {
      ctx.addIssue({
        code: "custom",
        message: "At least one item or a customCake request is required.",
        path: ["items"],
      });
    }

    if (data.fulfillmentType === "DELIVERY" && !data.deliveryAddress) {
      ctx.addIssue({
        code: "custom",
        message: "deliveryAddress is required for delivery orders.",
        path: ["deliveryAddress"],
      });
    }

    if (data.fulfillmentType === "PICKUP" && data.deliveryAddress) {
      ctx.addIssue({
        code: "custom",
        message: "deliveryAddress must be empty for pickup orders.",
        path: ["deliveryAddress"],
      });
    }
  });

export const orderIdParamsSchema = z.object({
  id: z.string().trim().min(1),
});
