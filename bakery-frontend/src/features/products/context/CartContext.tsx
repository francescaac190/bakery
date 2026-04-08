import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
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

const CART_KEY = "bakery_cart";
const CUSTOM_CAKE_KEY = "bakery_custom_cake";

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadCustomCakeFromStorage(): CustomCakeDetails | null {
  try {
    const raw = localStorage.getItem(CUSTOM_CAKE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      ...parsed,
      inspirationImageFile: null,
      inspirationImagePreview: null,
    };
  } catch {
    return null;
  }
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCartFromStorage);
  const [customCake, setCustomCakeState] = useState<CustomCakeDetails | null>(
    loadCustomCakeFromStorage,
  );

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (customCake) {
      const { inspirationImageFile, inspirationImagePreview, ...serializable } = customCake;
      localStorage.setItem(CUSTOM_CAKE_KEY, JSON.stringify(serializable));
    } else {
      localStorage.removeItem(CUSTOM_CAKE_KEY);
    }
  }, [customCake]);

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
    localStorage.removeItem(CART_KEY);
    setCustomCakeState((prev) => {
      if (prev?.inspirationImagePreview) {
        URL.revokeObjectURL(prev.inspirationImagePreview);
      }
      return null;
    });
    localStorage.removeItem(CUSTOM_CAKE_KEY);
    sessionStorage.removeItem("lastOrderId");
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
