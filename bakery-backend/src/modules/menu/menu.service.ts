import type { CreateCategoryInput, CreateProductInput, GetProductsFilters } from "./menu.types";
import { menuRepository } from "./menu.repository";

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

export const menuService = {
  getCategories,
  getProducts,
  createCategory,
  createProduct,
};
