type OrderStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "READY" | "COMPLETED" | "CANCELLED";
type ListOrdersFilters = {
    status?: OrderStatus;
    from?: string;
    to?: string;
    skip: number;
    take: number;
};
declare function listOrders(filters: ListOrdersFilters): Promise<{
    items: ({
        items: {
            id: string;
            createdAt: Date;
            currency: string;
            orderId: string;
            productId: string;
            quantity: number;
            unitPriceCents: number;
            notes: string | null;
        }[];
    } & {
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
    })[];
    total: number;
}>;
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
declare function updateOrderStatus(orderId: string, status: OrderStatus): Promise<{
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
export declare const adminOrdersRepository: {
    listOrders: typeof listOrders;
    findOrderById: typeof findOrderById;
    updateOrderStatus: typeof updateOrderStatus;
};
export {};
//# sourceMappingURL=adminOrders.repository.d.ts.map