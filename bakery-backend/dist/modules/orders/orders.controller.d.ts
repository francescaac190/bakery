import type { Request, Response } from "express";
declare function createOrder(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
declare function getOrderById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare const ordersController: {
    createOrder: typeof createOrder;
    getOrderById: typeof getOrderById;
};
export {};
//# sourceMappingURL=orders.controller.d.ts.map