type OrderStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "READY" | "COMPLETED" | "CANCELLED";
type ListOrdersInput = {
    status?: OrderStatus;
    from?: string;
    to?: string;
    page?: string;
    pageSize?: string;
};
declare function listOrders(input: ListOrdersInput): Promise<{
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
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}>;
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
export declare const adminOrdersService: {
    listOrders: typeof listOrders;
    updateOrderStatus: typeof updateOrderStatus;
};
export {};
//# sourceMappingURL=adminOrders.service.d.ts.map