"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderIdParamsSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
const isoDateSchema = zod_1.z
    .string()
    .datetime({ offset: true })
    .or(zod_1.z.string().datetime());
const customCakeSchema = zod_1.z.object({
    eventDate: isoDateSchema.optional(),
    servings: zod_1.z.number().int().positive().optional(),
    size: zod_1.z.string().trim().min(1).max(50).optional(),
    flavor: zod_1.z.string().trim().min(1).max(100).optional(),
    filling: zod_1.z.string().trim().min(1).max(100).optional(),
    frosting: zod_1.z.string().trim().min(1).max(100).optional(),
    messageOnCake: zod_1.z.string().trim().max(120).optional(),
    designNotes: zod_1.z.string().trim().max(1000).optional(),
    allergies: zod_1.z.string().trim().max(300).optional(),
    inspirationImage: zod_1.z.string().url().optional(),
    budgetCents: zod_1.z.number().int().nonnegative().optional(),
});
exports.createOrderSchema = zod_1.z
    .object({
    customerName: zod_1.z.string().trim().min(2).max(120),
    customerPhone: zod_1.z.string().trim().min(5).max(30),
    customerEmail: zod_1.z.string().email().optional(),
    fulfillmentType: zod_1.z.enum(["PICKUP", "DELIVERY"]),
    pickupAt: isoDateSchema.optional(),
    deliveryAddress: zod_1.z.string().trim().min(5).max(300).optional(),
    notes: zod_1.z.string().trim().max(1000).optional(),
    items: zod_1.z
        .array(zod_1.z.object({
        productId: zod_1.z.string().trim().min(1),
        quantity: zod_1.z.number().int().positive(),
        notes: zod_1.z.string().trim().max(300).optional(),
    }))
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
exports.orderIdParamsSchema = zod_1.z.object({
    id: zod_1.z.string().trim().min(1),
});
//# sourceMappingURL=orders.schemas.js.map