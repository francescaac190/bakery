import type { Request, Response } from "express";
declare function getCategories(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
declare function getProducts(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
declare function createCategory(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
declare function createProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare const menuController: {
    getCategories: typeof getCategories;
    getProducts: typeof getProducts;
    createCategory: typeof createCategory;
    createProduct: typeof createProduct;
};
export {};
//# sourceMappingURL=menu.controller.d.ts.map