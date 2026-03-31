import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ProductsList } from "../ui/ProductsList";
import { Cart } from "../ui/Cart";

export function ProductsPage() {
  const navigate = useNavigate();
  const { cartItems, customCake, increment, decrement, remove, removeCustomCake } = useCart();

  function handleEditCustomCake() {
    navigate("/personaliza");
  }

  return (
    <div>
      <header className="flex items-center justify-between bg-white sticky top-0 z-10 rounded-2xl px-4 sm:px-8 py-4 sm:py-5 mb-4 shadow-sm border border-border-card">
        <div className="flex flex-col gap-0.5 min-w-0 pr-3">
          <h1 className="font-display text-xl sm:text-2xl font-bold text-text-heading leading-tight">
            Selecciona tus productos
          </h1>
          <p className="hidden sm:block font-mono text-sm text-text-muted">
            Agrega los productos que deseas al carrito
          </p>
        </div>
        <Cart
          items={cartItems}
          customCake={customCake}
          onIncrement={increment}
          onDecrement={decrement}
          onRemove={remove}
          onEditCustomCake={handleEditCustomCake}
          onRemoveCustomCake={removeCustomCake}
        />
      </header>

      <ProductsList />
    </div>
  );
}
