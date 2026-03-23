import type { CreateOrderInput, CreateOrderResult } from "./orders.types";
declare function createOrder(input: CreateOrderInput): Promise<CreateOrderResult>;
declare function getOrderById(orderId: string): Promise<any>;
export declare const ordersService: {
    createOrder: typeof createOrder;
    getOrderById: typeof getOrderById;
};
export {};
//# sourceMappingURL=orders.service.d.ts.map