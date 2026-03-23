import type { Request, Response } from "express";
declare function getCategories(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
declare function getProducts(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare const menuController: {
    getCategories: typeof getCategories;
    getProducts: typeof getProducts;
};
export {};
//# sourceMappingURL=menu.controller.d.ts.map