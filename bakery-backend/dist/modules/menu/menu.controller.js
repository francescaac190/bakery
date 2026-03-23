import { sendSuccess } from "../../shared/http/response";
import { getProductsQuerySchema } from "./menu.schemas";
import { menuService } from "./menu.service";
async function getCategories(_req, res) {
    const categories = await menuService.getCategories();
    return sendSuccess(res, categories);
}
async function getProducts(req, res) {
    const query = getProductsQuerySchema.parse(req.query);
    const products = await menuService.getProducts(query);
    return sendSuccess(res, products);
}
export const menuController = {
    getCategories,
    getProducts,
};
//# sourceMappingURL=menu.controller.js.map