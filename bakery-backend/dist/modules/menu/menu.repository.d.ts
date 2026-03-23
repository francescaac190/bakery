import type { GetProductsFilters } from "./menu.types";
declare function findCategoriesWithActiveProducts(): Promise<any>;
declare function findActiveProducts(filters: GetProductsFilters): Promise<any>;
export declare const menuRepository: {
    findCategoriesWithActiveProducts: typeof findCategoriesWithActiveProducts;
    findActiveProducts: typeof findActiveProducts;
};
export {};
//# sourceMappingURL=menu.repository.d.ts.map