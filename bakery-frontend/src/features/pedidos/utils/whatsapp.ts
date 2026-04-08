import type {
  CartItem,
  CustomCakeDetails,
} from "../../products/context/CartContext";

export type DeliveryInfo = {
  fulfillmentType: "PICKUP" | "DELIVERY";
  deliveryAddress?: string;
  deliveryLocation?: { lat: number; lng: number };
  pickupAt?: string; // ISO string
  notes?: string;
};

export type ContactInfo = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
};

type BuildMessageParams = {
  cartItems: CartItem[];
  customCake: CustomCakeDetails | null;
  contact: ContactInfo;
  delivery: DeliveryInfo;
  orderId: string;
  inspirationImageUrl?: string;
};

export function buildWhatsAppMessage({
  cartItems,
  customCake,
  contact,
  delivery,
  orderId,
  inspirationImageUrl,
}: BuildMessageParams): string {
  const lines: string[] = [];

  lines.push("🎂 *NUEVO PEDIDO - La Bakery*");
  lines.push("");
  lines.push(`👤 *Cliente:* ${contact.customerName}`);
  lines.push(`📞 *Teléfono:* ${contact.customerPhone}`);
  if (contact.customerEmail) {
    lines.push(`📧 *Email:* ${contact.customerEmail}`);
  }

  if (cartItems.length > 0) {
    lines.push("");
    lines.push("🛒 *Productos:*");
    for (const { product, quantity, variantLabel, variantPriceCents } of cartItems) {
      const price = ((variantPriceCents ?? product.priceCents) / 100).toFixed(2);
      const variantStr = variantLabel ? ` (${variantLabel})` : "";
      lines.push(
        `• ${quantity}x ${product.name}${variantStr} — ${product.currency}. ${price}`,
      );
    }
  }

  if (customCake) {
    lines.push("");
    lines.push("🎂 *Torta personalizada:* Precio a consultar");
    if (customCake.servings)
      lines.push(`  • Porciones: ${customCake.servings}`);
    if (customCake.flavor) lines.push(`  • Sabor: ${customCake.flavor}`);
    if (customCake.filling) lines.push(`  • Relleno: ${customCake.filling}`);
    if (customCake.frosting)
      lines.push(`  • Cobertura: ${customCake.frosting}`);
    if (customCake.messageOnCake)
      lines.push(`  • Mensaje: "${customCake.messageOnCake}"`);
    if (customCake.designNotes)
      lines.push(`  • Notas: "${customCake.designNotes}"`);
    const imageUrl = inspirationImageUrl;
    if (imageUrl) lines.push(`  • 🖼️ Imagen de diseño: ${imageUrl}`);
  }

  lines.push("");
  if (delivery.fulfillmentType === "DELIVERY") {
    lines.push("🚚 *Entrega:* Envío a domicilio");
    if (delivery.deliveryAddress)
      lines.push(`📍 *Dirección:* ${delivery.deliveryAddress}`);
    if (delivery.deliveryLocation) {
      const { lat, lng } = delivery.deliveryLocation;
      lines.push(
        `🗺️ *Ubicación exacta:* https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}`,
      );
    }
  } else {
    lines.push("🏪 *Retiro en tienda*");
    if (delivery.pickupAt) {
      const date = new Date(delivery.pickupAt);
      const formatted = date.toLocaleString("es-BO", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
      lines.push(`📅 *Fecha y hora:* ${formatted}`);
    }
  }

  if (delivery.notes) {
    lines.push("");
    lines.push(`📝 *Notas extra:* ${delivery.notes}`);
  }

  if (cartItems.length > 0) {
    const total = cartItems.reduce(
      (sum, { product, quantity, variantPriceCents }) =>
        sum + (variantPriceCents ?? product.priceCents) * quantity,
      0,
    );
    const currency = cartItems[0].product.currency;
    lines.push("");
    lines.push(
      `💰 *Total productos fijos:* ${currency}. ${(total / 100).toFixed(2)}`,
    );
    if (customCake) lines.push("   *(+ torta personalizada a confirmar)*");
  }

  lines.push("");
  lines.push(`📋 *Pedido #${orderId.slice(-6).toUpperCase()}*`);

  return lines.join("\n");
}

export const WHATSAPP_NUMBER = "59178004552";

export function openWhatsApp(message: string): void {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}
