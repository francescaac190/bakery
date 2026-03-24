"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuController = void 0;
const response_1 = require("../../shared/http/response");
const menu_schemas_1 = require("./menu.schemas");
const menu_service_1 = require("./menu.service");
async function getCategories(_req, res) {
    const categories = await menu_service_1.menuService.getCategories();
    return (0, response_1.sendSuccess)(res, categories);
}
async function getProducts(req, res) {
    const query = menu_schemas_1.getProductsQuerySchema.parse(req.query);
    const products = await menu_service_1.menuService.getProducts(query);
    return (0, response_1.sendSuccess)(res, products);
}
async function createCategory(req, res) {
    const body = menu_schemas_1.createCategorySchema.parse(req.body);
    const category = await menu_service_1.menuService.createCategory(body);
    return (0, response_1.sendSuccess)(res, category, 201);
}
async function createProduct(req, res) {
    const body = menu_schemas_1.createProductSchema.parse(req.body);
    const product = await menu_service_1.menuService.createProduct(body);
    return (0, response_1.sendSuccess)(res, product, 201);
}
exports.menuController = {
    getCategories,
    getProducts,
    createCategory,
    createProduct,
};
//# sourceMappingURL=menu.controller.js.map