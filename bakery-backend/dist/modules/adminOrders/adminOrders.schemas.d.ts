import { z } from "zod";
export declare const listOrdersQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        CONFIRMED: "CONFIRMED";
        IN_PROGRESS: "IN_PROGRESS";
        READY: "READY";
        COMPLETED: "COMPLETED";
        CANCELLED: "CANCELLED";
    }>>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodString>;
    pageSize: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateOrderStatusParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const updateOrderStatusBodySchema: z.ZodObject<{
    status: z.ZodEnum<{
        PENDING: "PENDING";
        CONFIRMED: "CONFIRMED";
        IN_PROGRESS: "IN_PROGRESS";
        READY: "READY";
        COMPLETED: "COMPLETED";
        CANCELLED: "CANCELLED";
    }>;
}, z.core.$strip>;
//# sourceMappingURL=adminOrders.schemas.d.ts.map