import type { CreateOrderInput, CreateOrderResult } from "./orders.types";
declare function createOrder(input: CreateOrderInput): Promise<CreateOrderResult>;
declare function getOrderById(orderId: string): Promise<{
    status: import(".prisma/client").$Enums.OrderStatus;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    currency: string;
    notes: string | null;
    fulfillmentType: import(".prisma/client").$Enums.FulfillmentType;
    customerName: string;
    customerPhone: string;
    customerEmail: string | null;
    pickupAt: Date | null;
    deliveryAddress: string | null;
    totalCents: number;
}>;
export declare const ordersService: {
    createOrder: typeof createOrder;
    getOrderById: typeof getOrderById;
};
export {};
//# sourceMappingURL=orders.service.d.ts.map