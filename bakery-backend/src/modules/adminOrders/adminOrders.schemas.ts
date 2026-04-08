import { z } from "zod";

const statusEnum = z.enum([
  "PENDING",
  "APPROVED",
  "IN_PROGRESS",
  "READY",
  "DELIVERED",
  "PICKED_UP",
  "CANCELLED",
]);

export const listOrdersQuerySchema = z.object({
  status: statusEnum.optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  search: z.string().optional(),
  page: z.string().optional(),
  pageSize: z.string().optional(),
});

export const orderIdParamsSchema = z.object({
  id: z.string().trim().min(1),
});

export const updateOrderStatusBodySchema = z.object({
  status: statusEnum,
});

export const updateAdminNotesBodySchema = z.object({
  adminNotes: z.string().max(2000).nullable(),
});

export const setCustomCakePriceBodySchema = z.object({
  priceCents: z.number().int().positive(),
});

export const updateOrderStatusParamsSchema = orderIdParamsSchema;
