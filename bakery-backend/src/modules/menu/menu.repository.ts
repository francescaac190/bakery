import { prisma } from "../../db/prisma";
import type { CreateCategoryInput, CreateProductInput, GetProductsFilters, UpdateCategoryInput, UpdateProductInput } from "./menu.types";

async function findCategoriesWithActiveProducts() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { name: "asc" },
        include: {
          variants: {
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
          },
        },
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
      variants: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

async function createCategory(data: CreateCategoryInput) {
  return prisma.category.create({ data });
}

async function createProduct(data: CreateProductInput) {
  const { variants, ...productData } = data;
  return prisma.product.create({
    data: {
      ...productData,
      ...(variants && variants.length > 0
        ? {
            variants: {
              create: variants.map((v) => ({
                label: v.label,
                priceCents: v.priceCents,
                sortOrder: v.sortOrder,
                isActive: v.isActive,
              })),
            },
          }
        : {}),
    },
    include: { category: true, variants: { orderBy: { sortOrder: "asc" } } },
  });
}

async function findAllCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { products: { orderBy: { name: "asc" } } },
  });
}

async function findAllProducts(filters: GetProductsFilters) {
  return prisma.product.findMany({
    where: {
      categoryId: filters.categoryId || undefined,
      name: filters.search
        ? { contains: filters.search, mode: "insensitive" }
        : undefined,
    },
    orderBy: { name: "asc" },
    include: {
      category: true,
      variants: { orderBy: { sortOrder: "asc" } },
    },
  });
}

async function findProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { variants: { orderBy: { sortOrder: "asc" } } },
  });
}

async function findCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } });
}

async function countProductsByCategory(categoryId: string) {
  return prisma.product.count({ where: { categoryId } });
}

async function updateProduct(id: string, data: UpdateProductInput) {
  const { variants, ...productData } = data;
  return prisma.$transaction(async (tx) => {
    // Update the product itself
    const product = await tx.product.update({
      where: { id },
      data: productData,
    });

    // Sync variants if provided
    if (variants !== undefined) {
      const existingVariants = await tx.productVariant.findMany({
        where: { productId: id },
      });
      const existingIds = new Set(existingVariants.map((v) => v.id));
      const incomingIds = new Set(
        variants.filter((v) => v.id).map((v) => v.id!),
      );

      // Delete variants that are no longer present
      const toDelete = [...existingIds].filter((eid) => !incomingIds.has(eid));
      if (toDelete.length > 0) {
        await tx.productVariant.deleteMany({
          where: { id: { in: toDelete } },
        });
      }

      // Upsert remaining
      for (const v of variants) {
        if (v.id && existingIds.has(v.id)) {
          await tx.productVariant.update({
            where: { id: v.id },
            data: {
              label: v.label,
              priceCents: v.priceCents,
              sortOrder: v.sortOrder,
              isActive: v.isActive,
            },
          });
        } else {
          await tx.productVariant.create({
            data: {
              productId: id,
              label: v.label,
              priceCents: v.priceCents,
              sortOrder: v.sortOrder,
              isActive: v.isActive,
            },
          });
        }
      }
    }

    // Return product with fresh variants
    return tx.product.findUniqueOrThrow({
      where: { id },
      include: {
        category: true,
        variants: { orderBy: { sortOrder: "asc" } },
      },
    });
  });
}

async function softDeleteProduct(id: string) {
  return prisma.product.update({ where: { id }, data: { isActive: false } });
}

async function updateCategory(id: string, data: UpdateCategoryInput) {
  return prisma.category.update({ where: { id }, data });
}

async function hardDeleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}

export const menuRepository = {
  findCategoriesWithActiveProducts,
  findActiveProducts,
  createCategory,
  createProduct,
  findAllCategories,
  findAllProducts,
  findProductById,
  findCategoryById,
  countProductsByCategory,
  updateProduct,
  softDeleteProduct,
  updateCategory,
  hardDeleteCategory,
};
