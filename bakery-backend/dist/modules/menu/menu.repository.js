"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuRepository = void 0;
const prisma_1 = require("../../db/prisma");
async function findCategoriesWithActiveProducts() {
    return prisma_1.prisma.category.findMany({
        orderBy: { name: "asc" },
        include: {
            products: {
                where: { isActive: true },
                orderBy: { name: "asc" },
            },
        },
    });
}
async function findActiveProducts(filters) {
    return prisma_1.prisma.product.findMany({
        where: {
            isActive: true,
            categoryId: filters.categoryId || undefined,
            name: filters.search
                ? {
                    contains: filters.search,
                    mode: "insensitive",
                }
                : undefined,
        },
        orderBy: { name: "asc" },
        include: {
            category: true,
        },
    });
}
async function createCategory(data) {
    return prisma_1.prisma.category.create({ data });
}
async function createProduct(data) {
    return prisma_1.prisma.product.create({
        data,
        include: { category: true },
    });
}
exports.menuRepository = {
    findCategoriesWithActiveProducts,
    findActiveProducts,
    createCategory,
    createProduct,
};
//# sourceMappingURL=menu.repository.js.map