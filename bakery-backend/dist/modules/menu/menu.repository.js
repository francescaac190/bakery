import { prisma } from "../../db/prisma";
async function findCategoriesWithActiveProducts() {
    return prisma.category.findMany({
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
    return prisma.product.findMany({
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
export const menuRepository = {
    findCategoriesWithActiveProducts,
    findActiveProducts,
};
//# sourceMappingURL=menu.repository.js.map