type OrderStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "READY" | "COMPLETED" | "CANCELLED";
type ListOrdersInput = {
    status?: OrderStatus;
    from?: string;
    to?: string;
    page?: string;
    pageSize?: string;
};
declare function listOrders(input: ListOrdersInput): Promise<{
    items: any;
    pagination: {
        page: number;
        pageSize: number;
        total: any;
        totalPages: number;
    };
}>;
declare function updateOrderStatus(orderId: string, status: OrderStatus): Promise<any>;
export declare const adminOrdersService: {
    listOrders: typeof listOrders;
    updateOrderStatus: typeof updateOrderStatus;
};
export {};
//# sourceMappingURL=adminOrders.service.d.ts.map