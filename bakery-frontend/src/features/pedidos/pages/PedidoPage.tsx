import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../products/context/CartContext";
import { submitOrder } from "../api";
import { buildWhatsAppMessage, openWhatsApp } from "../utils/whatsapp";
import productPlaceholder from "../../../assets/product-placeholder.svg";

type FulfillmentType = "PICKUP" | "DELIVERY";

function getMinDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export function PedidoPage() {
  const navigate = useNavigate();
  const { cartItems, customCake, clearCart } = useCart();

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && customCake === null) {
      navigate("/", { replace: true });
    }
  }, [cartItems, customCake, navigate]);

  // Contact
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Delivery
  const [fulfillment, setFulfillment] = useState<FulfillmentType>("DELIVERY");
  const [address, setAddress] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [notes, setNotes] = useState("");

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);

  const minDate = getMinDate();

  const subtotal = cartItems.reduce(
    (sum, { product, quantity }) => sum + product.priceCents * quantity,
    0,
  );
  const currency = cartItems[0]?.product.currency ?? "BOB";

  // Validation
  const isValid = useMemo(() => {
    if (!name.trim() || name.trim().length < 2) return false;
    if (!phone.trim() || phone.trim().length < 5) return false;
    if (fulfillment === "DELIVERY" && address.trim().length < 5) return false;
    if (fulfillment === "PICKUP" && (!pickupDate || !pickupTime)) return false;
    return true;
  }, [name, phone, fulfillment, address, pickupDate, pickupTime]);

  // WhatsApp preview (rebuilt on every relevant change)
  const whatsappPreview = useMemo(() => {
    if (!name || !phone) return "";
    const pickupAt =
      fulfillment === "PICKUP" && pickupDate && pickupTime
        ? new Date(`${pickupDate}T${pickupTime}`).toISOString()
        : undefined;
    return buildWhatsAppMessage({
      cartItems,
      customCake,
      contact: {
        customerName: name,
        customerPhone: phone,
        customerEmail: email || undefined,
      },
      delivery: {
        fulfillmentType: fulfillment,
        deliveryAddress: fulfillment === "DELIVERY" ? address : undefined,
        pickupAt,
        notes: notes || undefined,
      },
      orderId: "PREVIEW",
    });
  }, [
    name,
    phone,
    email,
    fulfillment,
    address,
    pickupDate,
    pickupTime,
    notes,
    cartItems,
    customCake,
  ]);

  async function handleSubmit() {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const pickupAt =
      fulfillment === "PICKUP" && pickupDate && pickupTime
        ? new Date(`${pickupDate}T${pickupTime}`).toISOString()
        : undefined;

    try {
      const result = await submitOrder(
        cartItems,
        customCake,
        {
          customerName: name.trim(),
          customerPhone: phone.trim(),
          customerEmail: email.trim() || undefined,
        },
        {
          fulfillmentType: fulfillment,
          deliveryAddress:
            fulfillment === "DELIVERY" ? address.trim() : undefined,
          pickupAt,
          notes: notes.trim() || undefined,
        },
      );

      const message = buildWhatsAppMessage({
        cartItems,
        customCake,
        contact: {
          customerName: name,
          customerPhone: phone,
          customerEmail: email || undefined,
        },
        delivery: {
          fulfillmentType: fulfillment,
          deliveryAddress: fulfillment === "DELIVERY" ? address : undefined,
          pickupAt,
          notes: notes || undefined,
        },
        orderId: result.orderId,
        inspirationImageUrl: result.inspirationImageUrl,
      });

      clearCart();
      // setSuccessOrderId(result.orderId);
      openWhatsApp(message);
    } catch (err) {
      setSubmitError(
        "Hubo un problema al registrar tu pedido. Por favor intenta de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // Success screen
  if (successOrderId) {
    return (
      <div className="min-h-screen bg-background5 flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl border border-border-card p-8 text-center">
          <div className="text-5xl mb-4">🎂</div>
          <h1 className="font-display text-2xl font-bold text-text-heading mb-2">
            ¡Pedido enviado!
          </h1>
          <p className="font-mono text-sm text-text-muted mb-4">
            Se abrió WhatsApp con los detalles de tu pedido. Te contactaremos
            pronto para confirmar.
          </p>
          <div className="bg-background5 rounded-xl p-3 mb-6">
            <p className="font-mono text-xs text-text-muted">
              Número de pedido
            </p>
            <p className="font-mono text-sm font-bold text-text-heading">
              #{successOrderId.slice(-6).toUpperCase()}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="app-button w-full"
          >
            Volver al menú
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background5">
      <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-border-card p-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-3 font-mono text-sm font-semibold text-text-primary hover:underline"
          >
            ← volver
          </button>
          <h1 className="font-display text-2xl font-bold text-text-heading">
            Revisa tu pedido
          </h1>
          <p className="font-mono text-sm text-text-muted mt-1">
            Cuando todo esté correcto, envía el detalle por WhatsApp.
          </p>
          <div className="mt-3 flex items-center justify-between rounded-lg border border-border-card bg-background5 px-4 py-2">
            <span className="font-mono text-xs text-text-muted">
              Paso final: Confirmación
            </span>
            <span className="font-mono text-xs font-semibold text-success-text">
              Listo para enviar
            </span>
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-2xl border border-border-card p-6">
          <h2 className="font-display text-lg font-bold text-text-heading mb-4">
            Resumen del pedido
          </h2>

          {cartItems.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex items-center gap-3 py-2 border-b border-background5 last:border-0"
            >
              <img
                src={product.imageUrl || productPlaceholder}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src = productPlaceholder;
                }}
                className="h-12 w-12 flex-shrink-0 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-mono text-sm font-semibold text-text-heading">
                  {product.name}
                </p>
                <p className="font-mono text-xs text-text-muted">x{quantity}</p>
              </div>
              <p className="font-mono text-sm font-bold text-text-heading">
                {currency}. {((product.priceCents * quantity) / 100).toFixed(2)}
              </p>
            </div>
          ))}

          {customCake && (
            <div className="mt-2 rounded-xl border border-border-card bg-background5 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-mono text-sm font-bold text-text-heading">
                  🎂 {customCake.productName}
                </p>
                <span className="rounded-full border border-border-card bg-white px-2.5 py-0.5 font-mono text-xs text-secondary">
                  precio a consultar
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {customCake.servings && (
                  <div className="flex justify-between">
                    <span className="font-mono text-xs text-text-muted">
                      Porciones
                    </span>
                    <span className="font-mono text-xs text-text-heading">
                      {customCake.servings}
                    </span>
                  </div>
                )}
                {customCake.flavor && (
                  <div className="flex justify-between">
                    <span className="font-mono text-xs text-text-muted">
                      Sabor
                    </span>
                    <span className="font-mono text-xs text-text-heading">
                      {customCake.flavor}
                    </span>
                  </div>
                )}
                {customCake.filling && (
                  <div className="flex justify-between">
                    <span className="font-mono text-xs text-text-muted">
                      Relleno
                    </span>
                    <span className="font-mono text-xs text-text-heading">
                      {customCake.filling}
                    </span>
                  </div>
                )}
                {customCake.frosting && (
                  <div className="flex justify-between">
                    <span className="font-mono text-xs text-text-muted">
                      Cobertura
                    </span>
                    <span className="font-mono text-xs text-text-heading">
                      {customCake.frosting}
                    </span>
                  </div>
                )}
                {customCake.messageOnCake && (
                  <div className="col-span-2 flex justify-between">
                    <span className="font-mono text-xs text-text-muted">
                      Mensaje
                    </span>
                    <span className="font-mono text-xs text-text-heading">
                      "{customCake.messageOnCake}"
                    </span>
                  </div>
                )}
                {customCake.designNotes && (
                  <div className="col-span-2 flex justify-between">
                    <span className="font-mono text-xs text-text-muted">
                      Notas
                    </span>
                    <span className="font-mono text-xs text-text-heading">
                      {customCake.designNotes}
                    </span>
                  </div>
                )}
                {customCake.inspirationImageFile && (
                  <div className="col-span-2 mt-1">
                    {customCake.inspirationImagePreview && (
                      <img
                        src={customCake.inspirationImagePreview}
                        alt="Diseño de referencia"
                        className="h-24 w-full rounded-lg object-contain bg-white border border-border-card"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="mt-3 flex items-center justify-between border-t border-background5 pt-3">
              <span className="font-mono text-sm text-text-muted">
                Subtotal productos
              </span>
              <span className="font-display text-lg font-bold text-text-heading">
                {currency}. {(subtotal / 100).toFixed(2)}
              </span>
            </div>
          )}
          {customCake && (
            <p className="mt-1 font-mono text-xs text-text-muted text-right">
              + torta personalizada a confirmar
            </p>
          )}
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-border-card p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-text-heading">
            Datos de contacto
          </h2>
          <div>
            <label className="block font-mono text-xs text-text-muted mb-1">
              Nombre completo *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. María García"
              maxLength={120}
              className="w-full rounded-xl border border-border-card bg-background5 px-4 py-2.5 font-mono text-sm text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-text-muted mb-1">
              Teléfono / WhatsApp *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej. 70012345"
              maxLength={30}
              className="w-full rounded-xl border border-border-card bg-background5 px-4 py-2.5 font-mono text-sm text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-text-muted mb-1">
              Correo electrónico{" "}
              <span className="text-text-muted">(opcional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ej. maria@gmail.com"
              className="w-full rounded-xl border border-border-card bg-background5 px-4 py-2.5 font-mono text-sm text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Delivery */}
        <div className="bg-white rounded-2xl border border-border-card p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-text-heading">
            Detalle de entrega
          </h2>

          {/* Fulfillment selector */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFulfillment("DELIVERY")}
              className={`rounded-xl border py-3 font-mono text-sm font-semibold transition-colors ${
                fulfillment === "DELIVERY"
                  ? "border-primary bg-background5 text-primary"
                  : "border-border-card bg-white text-text-muted hover:bg-background5"
              }`}
            >
              📦 Envío
            </button>
            <button
              type="button"
              onClick={() => setFulfillment("PICKUP")}
              className={`rounded-xl border py-3 font-mono text-sm font-semibold transition-colors ${
                fulfillment === "PICKUP"
                  ? "border-primary bg-background5 text-primary"
                  : "border-border-card bg-white text-text-muted hover:bg-background5"
              }`}
            >
              🏪 Recojo en tienda
            </button>
          </div>

          {fulfillment === "DELIVERY" && (
            <div>
              <label className="block font-mono text-xs text-text-muted mb-1">
                Dirección de entrega *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ej. Av. Arce 1234, Dpto 3"
                maxLength={300}
                className="w-full rounded-xl border border-border-card bg-background5 px-4 py-2.5 font-mono text-sm text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="mt-3">
                <label className="block font-mono text-xs text-text-muted mb-1">
                  Fecha y hora de entrega *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={pickupDate}
                    min={minDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full rounded-xl border border-border-card bg-background5 px-4 py-2.5 font-mono text-sm text-text-heading focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full rounded-xl border border-border-card bg-background5 px-4 py-2.5 font-mono text-sm text-text-heading focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {fulfillment === "PICKUP" && (
            <div>
              <div className="mb-3 flex items-start gap-2 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-2">
                <span className="font-mono text-sm">⚠️</span>
                <p className="font-mono text-xs text-yellow-800">
                  Se requiere mínimo 2 días de anticipación para retiro en
                  tienda.
                </p>
              </div>
              <label className="block font-mono text-xs text-text-muted mb-1">
                Fecha de retiro *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={pickupDate}
                  min={minDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full rounded-xl border border-border-card bg-background5 px-4 py-2.5 font-mono text-sm text-text-heading focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full rounded-xl border border-border-card bg-background5 px-4 py-2.5 font-mono text-sm text-text-heading focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-mono text-xs text-text-muted mb-1">
              Notas extra <span className="text-text-muted">(opcional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Alergias, referencias adicionales, horario preferido..."
              rows={2}
              className="w-full rounded-xl border border-border-card bg-background5 px-4 py-2.5 font-mono text-sm text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        </div>

        {/* WhatsApp message preview */}
        {whatsappPreview && (
          <div className="bg-white rounded-2xl border border-border-card p-6">
            <h2 className="font-display text-lg font-bold text-text-heading mb-3">
              Mensaje que se enviará
            </h2>
            <pre className="whitespace-pre-wrap rounded-xl bg-background5 p-4 font-mono text-xs text-text-secondary leading-relaxed overflow-x-auto">
              {whatsappPreview}
            </pre>
          </div>
        )}

        {/* Error */}
        {submitError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="font-mono text-sm text-red-700">{submitError}</p>
          </div>
        )}

        {/* Note */}
        <div className="rounded-xl bg-success-background px-4 py-3 text-center">
          <p className="font-mono text-xs text-success-text">
            Al confirmar, se abrirá WhatsApp para completar tu pedido con La
            Bakery. 🎂
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="app-button-ghost flex-1"
          >
            ← Editar pedido
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            // disabled={!isValid || isSubmitting}
            className="app-button"
            style={{ flex: 2 }}
          >
            {isSubmitting ? "Enviando..." : "Enviar por WhatsApp →"}
          </button>
        </div>
      </div>
    </div>
  );
}
