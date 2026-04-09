export type FulfillmentType = "PICKUP" | "DELIVERY";
export type OrderStatus =
  | "PENDING"
  | "APPROVED"
  | "IN_PROGRESS"
  | "READY"
  | "DELIVERED"
  | "PICKED_UP"
  | "CANCELLED";

export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  fulfillmentType: FulfillmentType;
  pickupAt?: string;
  deliveryAddress?: string;
  notes?: string;
  items: Array<{
    productId: string;
    quantity: number;
    variantId?: string;
    notes?: string;
  }>;
  customCake?: {
    eventDate?: string;
    servings?: number;
    size?: string;
    flavor?: string;
    filling?: string;
    frosting?: string;
    messageOnCake?: string;
    designNotes?: string;
    allergies?: string;
    inspirationImage?: string;
    budgetCents?: number;
  };
};

export type CreateOrderResult = {
  orderId: string;
  displayId: string;
  status: OrderStatus;
  totalCents: number;
  estimatedReadyAt: Date | null;
  inspirationImageUrl?: string;
};
