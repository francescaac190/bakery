import type { GetProductsFilters } from "./menu.types";
declare function getCategories(): Promise<any>;
declare function getProducts(filters: GetProductsFilters): Promise<any>;
export declare const menuService: {
    getCategories: typeof getCategories;
    getProducts: typeof getProducts;
};
export {};
//# sourceMappingURL=menu.service.d.ts.map