"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuService = void 0;
const menu_repository_1 = require("./menu.repository");
async function getCategories() {
    return menu_repository_1.menuRepository.findCategoriesWithActiveProducts();
}
async function getProducts(filters) {
    return menu_repository_1.menuRepository.findActiveProducts(filters);
}
async function createCategory(input) {
    return menu_repository_1.menuRepository.createCategory(input);
}
async function createProduct(input) {
    return menu_repository_1.menuRepository.createProduct(input);
}
exports.menuService = {
    getCategories,
    getProducts,
    createCategory,
    createProduct,
};
//# sourceMappingURL=menu.service.js.map