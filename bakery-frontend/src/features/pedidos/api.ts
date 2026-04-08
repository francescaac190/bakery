import { HttpError } from "../../api/http";
import type { CartItem, CustomCakeDetails } from "../products/context/CartContext";
import type { ContactInfo, DeliveryInfo } from "./utils/whatsapp";

export type SubmitOrderResult = {
  orderId: string;
  displayId?: string;
  status: string;
  totalCents: number;
  inspirationImageUrl?: string;
};

export type OrderTrackingData = {
  id: string;
  displayId: string;
  status: string;
  fulfillmentType: "PICKUP" | "DELIVERY";
  customerName: string;
  deliveryAddress?: string | null;
  pickupAt?: string | null;
  totalCents: number;
  currency: string;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    unitPriceCents: number;
    currency: string;
    variantLabel?: string | null;
    product: { name: string };
  }>;
  customCakeRequest?: {
    servings?: number | null;
    flavor?: string | null;
    filling?: string | null;
    frosting?: string | null;
    messageOnCake?: string | null;
    finalPriceCents?: number | null;
  } | null;
  statusLogs: Array<{
    id: string;
    status: string;
    createdAt: string;
  }>;
};

export async function submitOrder(
  cartItems: CartItem[],
  customCake: CustomCakeDetails | null,
  contact: ContactInfo,
  delivery: DeliveryInfo,
): Promise<SubmitOrderResult> {
  const apiUrl = import.meta.env.VITE_API_URL as string;

  const orderData = {
    customerName: contact.customerName,
    customerPhone: contact.customerPhone,
    customerEmail: contact.customerEmail || undefined,
    fulfillmentType: delivery.fulfillmentType,
    pickupAt: delivery.pickupAt || undefined,
    deliveryAddress: delivery.deliveryAddress || undefined,
    notes: delivery.notes || undefined,
    items: cartItems.map(({ product, quantity }) => ({
      productId: product.id,
      quantity,
    })),
    customCake: customCake
      ? {
          servings: customCake.servings ? parseServings(customCake.servings) : undefined,
          flavor: customCake.flavor || undefined,
          filling: customCake.filling || undefined,
          frosting: customCake.frosting || undefined,
          messageOnCake: customCake.messageOnCake || undefined,
          designNotes: customCake.designNotes || undefined,
        }
      : undefined,
  };

  const formData = new FormData();
  formData.append("data", JSON.stringify(orderData));

  if (customCake?.inspirationImageFile) {
    formData.append("inspirationImage", customCake.inspirationImageFile);
  }

  const res = await fetch(`${apiUrl}/orders`, {
    method: "POST",
    body: formData,
    // Do NOT set Content-Type — browser sets it automatically with boundary
  });

  const text = await res.text();
  const body = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new HttpError(res.status, body);
  }

  const result = body?.data;

  return {
    orderId: result.orderId,
    displayId: result.displayId,
    status: result.status,
    totalCents: result.totalCents,
    inspirationImageUrl: result.inspirationImageUrl,
  };
}

export async function fetchOrder(orderId: string): Promise<OrderTrackingData> {
  const apiUrl = import.meta.env.VITE_API_URL as string;
  const res = await fetch(`${apiUrl}/orders/${orderId}`);
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new HttpError(
      res.status,
      json,
      (json as any)?.error?.message ?? "Pedido no encontrado",
    );
  }
  const json = await res.json();
  return (json as { data: OrderTrackingData }).data;
}

// Map chip label "20 personas" → 20 (int), "Mini (2 personas)" → 2
function parseServings(label: string): number | undefined {
  const match = label.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : undefined;
}
