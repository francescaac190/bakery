"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusBodySchema = exports.updateOrderStatusParamsSchema = exports.listOrdersQuerySchema = void 0;
const zod_1 = require("zod");
const statusEnum = zod_1.z.enum([
    "PENDING",
    "CONFIRMED",
    "IN_PROGRESS",
    "READY",
    "COMPLETED",
    "CANCELLED",
]);
exports.listOrdersQuerySchema = zod_1.z.object({
    status: statusEnum.optional(),
    from: zod_1.z.string().datetime().optional(),
    to: zod_1.z.string().datetime().optional(),
    page: zod_1.z.string().optional(),
    pageSize: zod_1.z.string().optional(),
});
exports.updateOrderStatusParamsSchema = zod_1.z.object({
    id: zod_1.z.string().trim().min(1),
});
exports.updateOrderStatusBodySchema = zod_1.z.object({
    status: statusEnum,
});
//# sourceMappingURL=adminOrders.schemas.js.map