import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "../types";

export type CartItem = {
  product: Product;
  quantity: number;
  variantId?: string;
  variantLabel?: string;
  variantPriceCents?: number;
};

export type CustomCakeDetails = {
  productId: string; // frontend reference only — not sent to backend
  productName: string; // display name
  servings: string | null; // e.g. "Mini (2 personas)"
  flavor: string | null; // e.g. "Red Velvet"
  filling: string | null; // e.g. "Manjar"
  frosting: string | null; // e.g. "Queso crema"
  messageOnCake: string;
  designNotes: string;
  inspirationImageFile: File | null;
  inspirationImagePreview: string | null; // object URL for preview
};

type CartContextValue = {
  cartItems: CartItem[];
  customCake: CustomCakeDetails | null;
  addToCart: (product: Product, variant?: { id: string; label: string; priceCents: number }) => void;
  increment: (cartKey: string) => void;
  decrement: (cartKey: string) => void;
  remove: (cartKey: string) => void;
  setCustomCake: (details: CustomCakeDetails) => void;
  removeCustomCake: () => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customCake, setCustomCakeState] = useState<CustomCakeDetails | null>(
    null,
  );

  // Cart key uniquely identifies product + variant combo
  const getCartKey = (productId: string, variantId?: string) =>
    variantId ? `${productId}:${variantId}` : productId;

  const itemCartKey = (item: CartItem) =>
    getCartKey(item.product.id, item.variantId);

  const addToCart = (product: Product, variant?: { id: string; label: string; priceCents: number }) =>
    setCartItems((prev) => {
      const key = getCartKey(product.id, variant?.id);
      const existing = prev.find((item) => itemCartKey(item) === key);
      if (existing) {
        return prev.map((item) =>
          itemCartKey(item) === key
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, {
        product,
        quantity: 1,
        variantId: variant?.id,
        variantLabel: variant?.label,
        variantPriceCents: variant?.priceCents,
      }];
    });

  const increment = (cartKey: string) =>
    setCartItems((prev) =>
      prev.map((item) =>
        itemCartKey(item) === cartKey
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );

  const decrement = (cartKey: string) =>
    setCartItems((prev) =>
      prev
        .map((item) =>
          itemCartKey(item) === cartKey
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );

  const remove = (cartKey: string) =>
    setCartItems((prev) =>
      prev.filter((item) => itemCartKey(item) !== cartKey),
    );

  const setCustomCake = (details: CustomCakeDetails) =>
    setCustomCakeState(details);

  const removeCustomCake = () => {
    setCustomCakeState((prev) => {
      // Revoke object URL to avoid memory leak
      if (prev?.inspirationImagePreview) {
        URL.revokeObjectURL(prev.inspirationImagePreview);
      }
      return null;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setCustomCakeState((prev) => {
      if (prev?.inspirationImagePreview) {
        URL.revokeObjectURL(prev.inspirationImagePreview);
      }
      return null;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        customCake,
        addToCart,
        increment,
        decrement,
        remove,
        setCustomCake,
        removeCustomCake,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
