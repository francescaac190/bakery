type OrderStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "READY" | "COMPLETED" | "CANCELLED";
type ListOrdersFilters = {
    status?: OrderStatus;
    from?: string;
    to?: string;
    skip: number;
    take: number;
};
declare function listOrders(filters: ListOrdersFilters): Promise<{
    items: any;
    total: any;
}>;
declare function findOrderById(orderId: string): Promise<any>;
declare function updateOrderStatus(orderId: string, status: OrderStatus): Promise<any>;
export declare const adminOrdersRepository: {
    listOrders: typeof listOrders;
    findOrderById: typeof findOrderById;
    updateOrderStatus: typeof updateOrderStatus;
};
export {};
//# sourceMappingURL=adminOrders.repository.d.ts.map