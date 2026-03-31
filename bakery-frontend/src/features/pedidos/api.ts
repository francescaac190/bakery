import { HttpError } from "../../api/http";
import type { CartItem, CustomCakeDetails } from "../products/context/CartContext";
import type { ContactInfo, DeliveryInfo } from "./utils/whatsapp";

export type SubmitOrderResult = {
  orderId: string;
  status: string;
  totalCents: number;
  inspirationImageUrl?: string;
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
    status: result.status,
    totalCents: result.totalCents,
    inspirationImageUrl: result.inspirationImageUrl,
  };
}

// Map chip label "20 personas" → 20 (int), "Mini (2 personas)" → 2
function parseServings(label: string): number | undefined {
  const match = label.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : undefined;
}
