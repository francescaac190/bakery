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
declare function findActiveProductsByIds(productIds: string[]): Promise<{
    id: string;
    name: string;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    priceCents: number;
    currency: string;
    isActive: boolean;
    isCustom: boolean;
    categoryId: string | null;
}[]>;
declare function createOrderWithItems(input: CreateOrderWithPricesInput): Promise<any>;
declare function findOrderById(orderId: string): Promise<{
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
} | null>;
export declare const ordersRepository: {
    findActiveProductsByIds: typeof findActiveProductsByIds;
    createOrderWithItems: typeof createOrderWithItems;
    findOrderById: typeof findOrderById;
};
export {};
//# sourceMappingURL=orders.repository.d.ts.map