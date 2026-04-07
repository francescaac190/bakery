import type { CreateCategoryInput, CreateProductInput, GetProductsFilters, UpdateCategoryInput, UpdateProductInput } from "./menu.types";
import { menuRepository } from "./menu.repository";
import { AppError } from "../../shared/errors/app-error";

async function getCategories() {
  return menuRepository.findCategoriesWithActiveProducts();
}

async function getProducts(filters: GetProductsFilters) {
  return menuRepository.findActiveProducts(filters);
}

async function createCategory(input: CreateCategoryInput) {
  return menuRepository.createCategory(input);
}

async function createProduct(input: CreateProductInput) {
  return menuRepository.createProduct(input);
}

async function getAllCategories() {
  return menuRepository.findAllCategories();
}

async function getAllProducts(filters: GetProductsFilters) {
  return menuRepository.findAllProducts(filters);
}

async function updateProduct(id: string, input: UpdateProductInput) {
  const existing = await menuRepository.findProductById(id);
  if (!existing) {
    throw new AppError(404, "Product not found");
  }
  return menuRepository.updateProduct(id, input);
}

async function deleteProduct(id: string) {
  const existing = await menuRepository.findProductById(id);
  if (!existing) {
    throw new AppError(404, "Product not found");
  }
  return menuRepository.softDeleteProduct(id);
}

async function updateCategory(id: string, input: UpdateCategoryInput) {
  const existing = await menuRepository.findCategoryById(id);
  if (!existing) {
    throw new AppError(404, "Category not found");
  }
  return menuRepository.updateCategory(id, input);
}

async function deleteCategory(id: string) {
  const existing = await menuRepository.findCategoryById(id);
  if (!existing) {
    throw new AppError(404, "Category not found");
  }
  const productCount = await menuRepository.countProductsByCategory(id);
  if (productCount > 0) {
    throw new AppError(
      409,
      "Cannot delete category with existing products. Reassign or delete products first."
    );
  }
  return menuRepository.hardDeleteCategory(id);
}

export const menuService = {
  getCategories,
  getProducts,
  createCategory,
  createProduct,
  getAllCategories,
  getAllProducts,
  updateProduct,
  deleteProduct,
  updateCategory,
  deleteCategory,
};
