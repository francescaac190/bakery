import { useCart } from "../context/CartContext";
import { ProductsList } from "../ui/ProductsList";
import { Cart } from "../ui/Cart";

export function ProductsPage() {
  const { cartItems, addToCart, increment, decrement, remove } = useCart();

  return (
    <div>
      <header className="flex items-center justify-between bg-background3 sticky top-0 z-10 rounded-2xl px-8 py-5 mb-4 shadow-sm border border-border-subtle">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Selecciona tus productos
          </h1>
          <p className="text-sm text-text-muted">
            Agrega los productos que deseas comprar al carrito
          </p>
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
