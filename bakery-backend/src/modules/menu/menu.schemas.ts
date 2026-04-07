import { z } from "zod";

export const getProductsQuerySchema = z.object({
  categoryId: z.string().trim().optional(),
  search: z.string().trim().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().trim().min(1).max(80),
  imageUrl: z.string().url().optional(),
});

export const createProductSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional(),
  imageUrl: z.string().url().optional(),
  priceCents: z.number().int().positive(),
  currency: z.string().trim().length(3).default("BOB"),
  isActive: z.boolean().default(true),
  isCustom: z.boolean().default(false),
  categoryId: z.string().trim().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(500).nullish(),
  imageUrl: z.string().url().nullish(),
  priceCents: z.number().int().positive().optional(),
  currency: z.string().trim().length(3).optional(),
  isActive: z.boolean().optional(),
  isCustom: z.boolean().optional(),
  categoryId: z.string().trim().nullish(),
});

export const updateCategorySchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  imageUrl: z.string().url().nullish(),
});

export const menuItemParamsSchema = z.object({
  id: z.string().trim().min(1),
});
