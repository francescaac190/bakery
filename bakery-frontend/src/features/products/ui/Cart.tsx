import { useState } from "react";
import type { Product } from "../types";
import { AppButton } from "../../../components/ui/AppButton";
import productPlaceholder from "../../../assets/product-placeholder.svg";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartProps = {
  items: CartItem[];
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  onRemove: (productId: string) => void;
};

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

export function Cart({ items, onIncrement, onDecrement, onRemove }: CartProps) {
  const [isOpen, setIsOpen] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + item.product.priceCents * item.quantity,
    0,
  );
  const currency = items[0]?.product.currency ?? "BOB";
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-rose-100 bg-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
        aria-label="Abrir carrito"
      >
        <CartIcon className="h-5 w-5 text-rose-500" />
        {totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white shadow-sm">
            {totalItems > 9 ? "9+" : totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 top-14 z-20 w-96 overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-2xl">
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-rose-50 px-5 py-4">
              <h2 className="font-display text-base font-semibold text-stone-800">
                Tu carrito
              </h2>
              {totalItems > 0 && (
                <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-500">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              )}
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-14 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
                  <CartIcon className="h-7 w-7 text-rose-300" />
                </div>
                <div>
                  <p className="font-medium text-stone-600">Tu carrito está vacío</p>
                  <p className="mt-0.5 text-xs text-stone-400">Agrega algo delicioso ✨</p>
                </div>
              </div>
            ) : (
              <>
                <ul className="max-h-72 divide-y divide-rose-50 overflow-y-auto">
                  {items.map(({ product, quantity }) => (
                    <li key={product.id} className="flex items-center gap-3 px-5 py-3">
                      <img
                        src={product.imageUrl || productPlaceholder}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.src = productPlaceholder;
                        }}
                        className="h-12 w-12 flex-shrink-0 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-stone-700">
                          {product.name}
                        </p>
                        <p className="text-xs font-medium text-rose-400">
                          {currency}. {(product.priceCents / 100).toFixed(2)} c/u
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onDecrement(product.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-200 text-sm font-medium text-stone-500 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500"
                          aria-label="Disminuir"
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-sm font-bold text-stone-700">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onIncrement(product.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-rose-200 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-50"
                          aria-label="Aumentar"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemove(product.id)}
                        className="ml-1 flex h-6 w-6 items-center justify-center rounded-full text-xs text-stone-300 transition-colors hover:bg-red-50 hover:text-red-400"
                        aria-label="Eliminar"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-rose-50 bg-rose-50/40 px-5 py-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-stone-500">Total</span>
                    <span className="font-display text-xl font-bold text-stone-800">
                      {currency}. {(total / 100).toFixed(2)}
                    </span>
                  </div>
                  <AppButton className="w-full">Realizar pedido</AppButton>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
