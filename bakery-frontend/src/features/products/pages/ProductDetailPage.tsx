import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { useCart } from "../context/CartContext";
import productPlaceholder from "../../../assets/product-placeholder.svg";

const FLAVOR_OPTIONS = ["Vainilla", "Chocolate", "Red Velvet", "Zanahoria", "Limón"];
const FILLING_OPTIONS = ["Chocolate", "Brigadeiro", "Manjar", "Crema pastelera", "Queso crema"];
const FROSTING_OPTIONS = ["Sin cobertura", "Chocolate", "Queso crema"];
const SERVINGS_OPTIONS = ["Mini (2 personas)", "5 personas", "10 personas", "20 personas", "30 personas"];

export function ProductDetailPage() {
  const { state } = useLocation() as { state?: { product?: Product } };
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = state?.product;

  useEffect(() => {
    if (!product) navigate("/", { replace: true });
  }, [product, navigate]);

  if (!product) return null;

  function handleAddToCart() {
    addToCart(product!);
    navigate(-1);
  }

  function handlePersonalize() {
    navigate("/personaliza", { state: { product } });
  }

  return (
    <div className="min-h-screen bg-background5">
      <div className="mx-auto max-w-lg px-4 py-6 space-y-4">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="font-mono text-sm font-semibold text-text-primary hover:underline"
        >
          ← Volver al menú
        </button>

        {/* Hero image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-rose-50">
          <img
            src={product.imageUrl || productPlaceholder}
            alt={product.name}
            onError={(e) => { e.currentTarget.src = productPlaceholder; }}
            className="h-full w-full object-cover"
          />
          {product.isCustom && (
            <span className="absolute left-4 top-4 rounded-full bg-rose-500 px-3 py-1 text-sm font-semibold text-white shadow">
              Personalizable
            </span>
          )}
        </div>

        {/* Info card */}
        <div className="bg-white rounded-2xl border border-border-card p-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-rose-300">
            {product.categoryName}
          </span>
          <h1 className="font-display mt-1 text-2xl font-bold text-text-heading">
            {product.name}
          </h1>

          {product.description && (
            <p className="mt-3 font-mono text-sm leading-relaxed text-text-muted">
              {product.description}
            </p>
          )}

          <div className="mt-4">
            {product.isCustom ? (
              <span className="inline-flex items-center rounded-full border border-border-card bg-background5 px-3 py-1 font-mono text-sm font-semibold text-secondary">
                precio a consultar
              </span>
            ) : (
              <div className="inline-flex items-baseline gap-0.5 rounded-full bg-rose-50 px-4 py-1.5">
                <span className="text-sm font-semibold text-rose-400">{product.currency}.</span>
                <span className="text-2xl font-bold text-rose-600">
                  {(product.priceCents / 100).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Customization options (custom cakes only) */}
        {product.isCustom && (
          <div className="bg-white rounded-2xl border border-border-card p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-text-heading">
              Qué puedes personalizar
            </h2>

            <div>
              <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-text-muted">
                Porciones
              </p>
              <div className="flex flex-wrap gap-2">
                {SERVINGS_OPTIONS.map((opt) => (
                  <span key={opt} className="rounded-full border border-border-card bg-background5 px-3 py-1 font-mono text-xs text-text-secondary">
                    {opt}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-text-muted">
                Sabor de masa
              </p>
              <div className="flex flex-wrap gap-2">
                {FLAVOR_OPTIONS.map((opt) => (
                  <span key={opt} className="rounded-full border border-border-card bg-background5 px-3 py-1 font-mono text-xs text-text-secondary">
                    {opt}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-text-muted">
                Relleno
              </p>
              <div className="flex flex-wrap gap-2">
                {FILLING_OPTIONS.map((opt) => (
                  <span key={opt} className="rounded-full border border-border-card bg-background5 px-3 py-1 font-mono text-xs text-text-secondary">
                    {opt}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-text-muted">
                Cobertura
              </p>
              <div className="flex flex-wrap gap-2">
                {FROSTING_OPTIONS.map((opt) => (
                  <span key={opt} className="rounded-full border border-border-card bg-background5 px-3 py-1 font-mono text-xs text-text-secondary">
                    {opt}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border-card bg-background5 px-4 py-3">
              <p className="font-mono text-xs text-text-muted">
                También puedes incluir un <span className="font-semibold text-text-secondary">mensaje personalizado</span> y subir una{" "}
                <span className="font-semibold text-text-secondary">imagen de referencia</span> para el diseño.
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          type="button"
          onClick={product.isCustom ? handlePersonalize : handleAddToCart}
          className="app-button w-full"
        >
          {product.isCustom ? "✦ Personalizar tu torta →" : "+ Agregar al carrito"}
        </button>

      </div>
    </div>
  );
}
