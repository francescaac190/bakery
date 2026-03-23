import { prisma } from "../../db/prisma";
import type { GetProductsFilters } from "./menu.types";

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

async function findActiveProducts(filters: GetProductsFilters) {
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
