import type { GetProductsFilters } from "./menu.types";
import { menuRepository } from "./menu.repository";

async function getCategories() {
  return menuRepository.findCategoriesWithActiveProducts();
}

async function getProducts(filters: GetProductsFilters) {
  return menuRepository.findActiveProducts(filters);
}

export const menuService = {
  getCategories,
  getProducts,
};
