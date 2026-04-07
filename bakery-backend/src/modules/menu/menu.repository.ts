import { prisma } from "../../db/prisma";
import type { CreateCategoryInput, CreateProductInput, GetProductsFilters, UpdateCategoryInput, UpdateProductInput } from "./menu.types";

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

async function createCategory(data: CreateCategoryInput) {
  return prisma.category.create({ data });
}

async function createProduct(data: CreateProductInput) {
  return prisma.product.create({
    data,
    include: { category: true },
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
    include: { category: true },
  });
}

async function findProductById(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

async function findCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } });
}

async function countProductsByCategory(categoryId: string) {
  return prisma.product.count({ where: { categoryId } });
}

async function updateProduct(id: string, data: UpdateProductInput) {
  return prisma.product.update({ where: { id }, data, include: { category: true } });
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
