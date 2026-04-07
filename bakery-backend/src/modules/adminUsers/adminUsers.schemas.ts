import { z } from "zod";

export const createAdminUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().trim().min(1).max(80),
  role: z.enum(["SUPER_ADMIN", "STAFF"]).default("STAFF"),
});

export const updateAdminUserSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  role: z.enum(["SUPER_ADMIN", "STAFF"]).optional(),
  isActive: z.boolean().optional(),
});

export const adminUserParamsSchema = z.object({
  id: z.string().trim().min(1),
});
