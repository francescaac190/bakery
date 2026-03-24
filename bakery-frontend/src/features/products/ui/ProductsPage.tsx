import { useState } from "react";
import { ProductsList } from "./ProductsList";
import { Cart, type CartItem } from "./Cart";
import type { Product } from "../types";
import logo from "../../../assets/logo.jpeg";

export function ProductsPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) =>
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

  const increment = (productId: string) =>
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );

  const decrement = (productId: string) =>
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );

  const remove = (productId: string) =>
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId),
    );

  return (
    <div>
      <header className="sticky top-0 z-30 mb-8 flex items-center justify-between rounded-2xl border border-rose-100 bg-white/85 px-6 py-4 shadow-md backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Coco Limón"
            className="h-12 w-12 rounded-xl object-cover shadow-sm"
          />
          <div className="text-left">
            <p className="font-display text-lg font-semibold leading-tight text-rose-900">
              Coco Limón
            </p>
            <p className="text-xs font-medium tracking-wide text-rose-400">
              Pastelería artesanal
            </p>
          </div>
        </div>
        <Cart
          items={cartItems}
          onIncrement={increment}
          onDecrement={decrement}
          onRemove={remove}
        />
      </header>

      <ProductsList onAddToCart={addToCart} />
    </div>
  );
}
