import type { Request, Response } from "express";
declare function listOrders(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
declare function updateOrderStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare const adminOrdersController: {
    listOrders: typeof listOrders;
    updateOrderStatus: typeof updateOrderStatus;
};
export {};
//# sourceMappingURL=adminOrders.controller.d.ts.map