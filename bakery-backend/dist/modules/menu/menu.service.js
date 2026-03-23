import { menuRepository } from "./menu.repository";
async function getCategories() {
    return menuRepository.findCategoriesWithActiveProducts();
}
async function getProducts(filters) {
    return menuRepository.findActiveProducts(filters);
}
export const menuService = {
    getCategories,
    getProducts,
};
//# sourceMappingURL=menu.service.js.map