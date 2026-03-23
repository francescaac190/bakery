import type { CreateOrderInput } from "./orders.types";
type CreateOrderWithPricesInput = Omit<CreateOrderInput, "items"> & {
    items: Array<{
        productId: string;
        quantity: number;
        notes?: string;
        unitPriceCents: number;
        currency: string;
    }>;
    totalCents: number;
};
declare function findActiveProductsByIds(productIds: string[]): Promise<any>;
declare function createOrderWithItems(input: CreateOrderWithPricesInput): Promise<any>;
declare function findOrderById(orderId: string): Promise<any>;
export declare const ordersRepository: {
    findActiveProductsByIds: typeof findActiveProductsByIds;
    createOrderWithItems: typeof createOrderWithItems;
    findOrderById: typeof findOrderById;
};
export {};
//# sourceMappingURL=orders.repository.d.ts.map