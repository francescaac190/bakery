import { z } from "zod";
const statusEnum = z.enum([
    "PENDING",
    "CONFIRMED",
    "IN_PROGRESS",
    "READY",
    "COMPLETED",
    "CANCELLED",
]);
export const listOrdersQuerySchema = z.object({
    status: statusEnum.optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    page: z.string().optional(),
    pageSize: z.string().optional(),
});
export const updateOrderStatusParamsSchema = z.object({
    id: z.string().trim().min(1),
});
export const updateOrderStatusBodySchema = z.object({
    status: statusEnum,
});
//# sourceMappingURL=adminOrders.schemas.js.map