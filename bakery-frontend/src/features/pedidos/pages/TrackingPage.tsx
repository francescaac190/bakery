import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchOrder, type OrderTrackingData } from "../api";

const STATUS_STEPS = [
  { key: "PENDING", label: "Pendiente" },
  { key: "APPROVED", label: "Aprobado" },
  { key: "IN_PROGRESS", label: "En proceso" },
  { key: "READY", label: "Listo" },
];

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  IN_PROGRESS: "En proceso",
  READY: "Listo",
  DELIVERED: "Entregado",
  PICKED_UP: "Retirado",
  CANCELLED: "Cancelado",
};

const POLL_INTERVAL = 30_000;

export function TrackingPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderTrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    if (!id) return;
    const fetchAndSet = async () => {
      try {
        const data = await fetchOrder(id);
        setOrder(data);
        setLastUpdated(new Date());
        setError(null);
      } catch {
        setError("No se pudo encontrar el pedido.");
      }
    };
    fetchAndSet();
    const timer = setInterval(fetchAndSet, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-background5 flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl border border-border-card p-8 text-center">
          <div className="text-4xl mb-4">😕</div>
          <h1 className="font-mono text-xl font-bold text-text-heading mb-2">
            Pedido no encontrado
          </h1>
          <p className="font-mono text-sm text-text-muted mb-4">{error}</p>
          <Link to="/" className="app-button inline-block">
            Volver al menu
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background5 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-text-heading border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isCancelled = order.status === "CANCELLED";
  const isTerminal = ["DELIVERED", "PICKED_UP", "CANCELLED"].includes(
    order.status,
  );
  const currentStepIndex = STATUS_STEPS.findIndex(
    (s) => s.key === order.status,
  );

  function formatPrice(cents: number) {
    return `${order!.currency} ${(cents / 100).toFixed(2)}`;
  }

  const itemsTotal = order.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPriceCents,
    0,
  );
  const cakePrice = order.customCakeRequest?.finalPriceCents;
  const hasUnpricedCake = order.customCakeRequest && cakePrice == null;

  return (
    <div className="min-h-screen bg-background5">
      <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-border-card p-6">
          <div className="flex items-center justify-between mb-1">
            <h1 className="font-mono text-lg font-bold text-text-heading">
              {order.displayId}
            </h1>
            {isCancelled && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
                Cancelado
              </span>
            )}
            {isTerminal && !isCancelled && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                {STATUS_LABELS[order.status]}
              </span>
            )}
          </div>
          <p className="font-mono text-xs text-text-muted">
            Registrado el{" "}
            {new Date(order.createdAt).toLocaleDateString("es-BO", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Status Progress */}
        {!isCancelled && (
          <div className="bg-white rounded-2xl border border-border-card p-6">
            <div className="flex items-center justify-between">
              {STATUS_STEPS.map((step, i) => {
                const isActive = !isTerminal && step.key === order.status;
                const isPast = i <= currentStepIndex;

                return (
                  <div key={step.key} className="flex-1 flex flex-col items-center">
                    <div className="flex items-center w-full">
                      {i > 0 && (
                        <div
                          className={`flex-1 h-0.5 ${
                            isPast ? "bg-primary" : "bg-gray-200"
                          }`}
                        />
                      )}
                      <div
                        className={`w-4 h-4 rounded-full flex-shrink-0 ${
                          isActive
                            ? "bg-primary ring-4 ring-primary/20"
                            : isPast
                              ? "bg-primary"
                              : "bg-gray-200"
                        }`}
                      />
                      {i < STATUS_STEPS.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 ${
                            i < currentStepIndex ? "bg-primary" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                    <span
                      className={`text-[10px] mt-1.5 text-center ${
                        isPast ? "text-primary font-medium" : "text-text-muted"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
              {/* Terminal step */}
              <div className="flex-1 flex flex-col items-center">
                <div className="flex items-center w-full">
                  <div
                    className={`flex-1 h-0.5 ${
                      isTerminal ? "bg-primary" : "bg-gray-200"
                    }`}
                  />
                  <div
                    className={`w-4 h-4 rounded-full flex-shrink-0 ${
                      isTerminal ? "bg-primary" : "bg-gray-200"
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] mt-1.5 text-center ${
                    isTerminal ? "text-primary font-medium" : "text-text-muted"
                  }`}
                >
                  {order.fulfillmentType === "DELIVERY"
                    ? "Entregado"
                    : "Retirado"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border border-border-card p-6">
          <h2 className="font-mono text-sm font-bold text-text-heading mb-3">
            Resumen del pedido
          </h2>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-1">
              <span className="font-mono">
                {item.quantity}x {item.product.name}
                {item.variantLabel && (
                  <span className="text-text-muted">
                    {" "}&mdash; {item.variantLabel}
                  </span>
                )}
              </span>
              <span className="font-mono">
                {formatPrice(item.unitPriceCents * item.quantity)}
              </span>
            </div>
          ))}
          {order.customCakeRequest && (
            <div className="mt-2 pt-2 border-t border-border-card">
              <div className="flex justify-between text-sm font-mono">
                <span>Torta personalizada</span>
                <span>
                  {cakePrice != null
                    ? formatPrice(cakePrice)
                    : "Precio pendiente"}
                </span>
              </div>
              <div className="text-xs text-text-muted mt-1 space-y-0.5 font-mono">
                {order.customCakeRequest.flavor && (
                  <p>Sabor: {order.customCakeRequest.flavor}</p>
                )}
                {order.customCakeRequest.filling && (
                  <p>Relleno: {order.customCakeRequest.filling}</p>
                )}
                {order.customCakeRequest.frosting && (
                  <p>Cobertura: {order.customCakeRequest.frosting}</p>
                )}
              </div>
            </div>
          )}
          <div className="mt-3 pt-3 border-t border-border-card flex justify-between font-mono text-sm font-bold">
            <span>Total</span>
            <span>
              {hasUnpricedCake
                ? `${formatPrice(itemsTotal)} + pendiente`
                : formatPrice(order.totalCents)}
            </span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-white rounded-2xl border border-border-card p-6">
          <h2 className="font-mono text-sm font-bold text-text-heading mb-2">
            {order.fulfillmentType === "DELIVERY"
              ? "Datos de envio"
              : "Datos de retiro"}
          </h2>
          {order.deliveryAddress && (
            <p className="text-sm text-text-muted font-mono">
              {order.deliveryAddress}
            </p>
          )}
          {order.pickupAt && (
            <p className="text-sm text-text-muted font-mono">
              {new Date(order.pickupAt).toLocaleString("es-BO", {
                weekday: "long",
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>

        {/* Status History */}
        {order.statusLogs.length > 0 && (
          <div className="bg-white rounded-2xl border border-border-card p-6">
            <h2 className="font-mono text-sm font-bold text-text-heading mb-3">
              Historial
            </h2>
            <div className="space-y-2">
              {order.statusLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex justify-between text-sm font-mono"
                >
                  <span>{STATUS_LABELS[log.status] ?? log.status}</span>
                  <span className="text-text-muted text-xs">
                    {new Date(log.createdAt).toLocaleString("es-BO", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Auto-refresh indicator */}
        <p className="text-center text-[10px] text-text-muted font-mono">
          Actualizado{" "}
          {lastUpdated.toLocaleTimeString("es-BO", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          &middot; se actualiza cada 30s
        </p>

        <div className="text-center pb-4">
          <Link
            to="/"
            className="text-sm text-primary hover:underline font-mono"
          >
            &larr; Volver al menu
          </Link>
        </div>
      </div>
    </div>
  );
}
