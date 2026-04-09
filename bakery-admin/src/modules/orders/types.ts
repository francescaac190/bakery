export type OrderStatus = "PENDING" | "APPROVED" | "IN_PROGRESS" | "READY" | "DELIVERED" | "PICKED_UP" | "CANCELLED";
export type FulfillmentType = "PICKUP" | "DELIVERY";

export type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  unitPriceCents: number;
  currency: string;
  notes?: string | null;
  variantLabel?: string | null;
  product: { id: string; name: string; imageUrl?: string | null };
};

export type CustomCakeRequest = {
  id: string;
  servings?: number | null;
  size?: string | null;
  flavor?: string | null;
  filling?: string | null;
  frosting?: string | null;
  messageOnCake?: string | null;
  designNotes?: string | null;
  allergies?: string | null;
  inspirationImage?: string | null;
  budgetCents?: number | null;
  finalPriceCents?: number | null;
  pricedAt?: string | null;
};

export type StatusLog = {
  id: string;
  status: OrderStatus;
  changedBy?: string | null;
  createdAt: string;
};

export type OrderSummary = {
  id: string;
  displayId: string;
  status: OrderStatus;
  fulfillmentType: FulfillmentType;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  totalCents: number;
  currency: string;
  createdAt: string;
  items: OrderItem[];
  customCakeRequest?: CustomCakeRequest | null;
};

export type OrderDetail = OrderSummary & {
  deliveryAddress?: string | null;
  pickupAt?: string | null;
  notes?: string | null;
  adminNotes?: string | null;
  statusLogs: StatusLog[];
};

export type OrdersListResponse = {
  items: OrderSummary[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
};

export type OrderFilters = {
  status?: OrderStatus;
  from?: string;
  to?: string;
  search?: string;
  page?: number;
  pageSize?: number;
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  IN_PROGRESS: "En proceso",
  READY: "Listo",
  DELIVERED: "Entregado",
  PICKED_UP: "Retirado",
  CANCELLED: "Cancelado",
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-gray-100 text-gray-700",
  APPROVED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  READY: "bg-emerald-100 text-emerald-700",
  DELIVERED: "bg-green-100 text-green-800",
  PICKED_UP: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-700",
};
