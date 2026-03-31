import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CartItem } from "../context/CartContext";
import type { CustomCakeDetails } from "../context/CartContext";
import productPlaceholder from "../../../assets/product-placeholder.svg";

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
      />
    </svg>
  );
}

type CartProps = {
  items: CartItem[];
  customCake: CustomCakeDetails | null;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  onRemove: (productId: string) => void;
  onEditCustomCake: () => void;
  onRemoveCustomCake: () => void;
};

export function Cart({
  items,
  customCake,
  onIncrement,
  onDecrement,
  onRemove,
  onEditCustomCake,
  onRemoveCustomCake,
}: CartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const total = items.reduce(
    (sum, item) => sum + item.product.priceCents * item.quantity,
    0,
  );
  const currency = items[0]?.product.currency ?? "BOB";
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0) + (customCake ? 1 : 0);
  const isEmpty = items.length === 0 && customCake === null;

  function handleCheckout() {
    setIsOpen(false);
    navigate("/pedido");
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border-card bg-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
        aria-label="Abrir carrito"
      >
        <CartIcon className="h-5 w-5 text-secondary" />
        {totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-cta text-xs font-bold text-white shadow-sm">
            {totalItems > 9 ? "9+" : totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed bottom-0 left-0 right-0 z-20 overflow-hidden rounded-t-2xl border border-border-card bg-white shadow-2xl sm:absolute sm:bottom-auto sm:left-auto sm:right-0 sm:top-14 sm:w-96 sm:rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-card px-5 py-4">
              <h2 className="font-display text-base font-bold text-text-heading">
                Tu carrito
              </h2>
              {totalItems > 0 && (
                <span className="rounded-full bg-background5 px-2.5 py-0.5 font-mono text-xs font-semibold text-secondary">
                  {totalItems} {totalItems === 1 ? "ítem" : "ítems"}
                </span>
              )}
            </div>

            {isEmpty ? (
              <div className="flex flex-col items-center gap-3 py-14 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background5">
                  <CartIcon className="h-7 w-7 text-border-subtle" />
                </div>
                <div>
                  <p className="font-mono font-semibold text-text-secondary">
                    Tu carrito está vacío
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-text-muted">
                    Agrega algo delicioso ✨
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="max-h-80 overflow-y-auto divide-y divide-background5">
                  {/* Regular items */}
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-3 px-5 py-3">
                      <img
                        src={product.imageUrl || productPlaceholder}
                        alt={product.name}
                        onError={(e) => { e.currentTarget.src = productPlaceholder; }}
                        className="h-12 w-12 flex-shrink-0 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-mono text-sm font-semibold text-text-heading">
                          {product.name}
                        </p>
                        <p className="font-mono text-xs text-text-muted">
                          {currency}. {(product.priceCents / 100).toFixed(2)} c/u
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onDecrement(product.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-border-card font-mono text-sm text-text-muted transition-colors hover:border-primary hover:bg-background5 hover:text-primary"
                          aria-label="Disminuir"
                        >
                          −
                        </button>
                        <span className="w-5 text-center font-mono text-sm font-bold text-text-heading">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onIncrement(product.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-border-card font-mono text-sm text-primary transition-colors hover:bg-background5"
                          aria-label="Aumentar"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(product.id)}
                        className="ml-1 flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs text-text-muted transition-colors hover:bg-red-50 hover:text-red-400"
                        aria-label="Eliminar"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* Custom cake row */}
                  {customCake && (
                    <div className="px-5 py-3">
                      <div className="rounded-xl border border-border-card bg-background5 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-mono text-sm font-semibold text-text-heading">
                                🎂 {customCake.productName}
                              </p>
                              <span className="rounded-full border border-border-card bg-white px-2 py-0.5 font-mono text-xs text-secondary">
                                precio a consultar
                              </span>
                            </div>
                            <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5">
                              {customCake.servings && (
                                <p className="font-mono text-xs text-text-muted">
                                  <span className="text-text-secondary">Porciones:</span> {customCake.servings}
                                </p>
                              )}
                              {customCake.flavor && (
                                <p className="font-mono text-xs text-text-muted">
                                  <span className="text-text-secondary">Sabor:</span> {customCake.flavor}
                                </p>
                              )}
                              {customCake.filling && (
                                <p className="font-mono text-xs text-text-muted">
                                  <span className="text-text-secondary">Relleno:</span> {customCake.filling}
                                </p>
                              )}
                              {customCake.frosting && (
                                <p className="font-mono text-xs text-text-muted">
                                  <span className="text-text-secondary">Cobertura:</span> {customCake.frosting}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={onRemoveCustomCake}
                            className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs text-text-muted transition-colors hover:bg-red-50 hover:text-red-400"
                            aria-label="Quitar torta"
                          >
                            ✕
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setIsOpen(false); onEditCustomCake(); }}
                          className="mt-2 font-mono text-xs text-primary hover:underline"
                        >
                          ✏️ Editar detalles
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-border-card bg-background5/40 px-5 py-4">
                  {items.length > 0 && (
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-mono text-sm text-text-muted">Subtotal productos</span>
                      <span className="font-display text-lg font-bold text-text-heading">
                        {currency}. {(total / 100).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {customCake && (
                    <p className="mb-3 font-mono text-xs text-text-muted">
                      + torta personalizada a confirmar
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="app-button w-full"
                  >
                    Realizar pedido →
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
