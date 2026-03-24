"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductSchema = exports.createCategorySchema = exports.getProductsQuerySchema = void 0;
const zod_1 = require("zod");
exports.getProductsQuerySchema = zod_1.z.object({
    categoryId: zod_1.z.string().trim().optional(),
    search: zod_1.z.string().trim().optional(),
});
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1).max(80),
    imageUrl: zod_1.z.string().url().optional(),
});
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1).max(120),
    description: zod_1.z.string().trim().max(500).optional(),
    imageUrl: zod_1.z.string().url().optional(),
    priceCents: zod_1.z.number().int().positive(),
    currency: zod_1.z.string().trim().length(3).default("BOB"),
    isActive: zod_1.z.boolean().default(true),
    isCustom: zod_1.z.boolean().default(false),
    categoryId: zod_1.z.string().trim().optional(),
});
//# sourceMappingURL=menu.schemas.js.map