import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Product } from "../types";
import { fetchProducts } from "../api";
import { useCart } from "../context/CartContext";
import productPlaceholder from "../../../assets/product-placeholder.svg";
import { AppButton } from "../../../components/ui/AppButton";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation() as { state: { product?: Product } | null };
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(state?.product ?? null);
  const [loading, setLoading] = useState(!state?.product);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) return;
    fetchProducts()
      .then((all) => {
        const found = all.find((p) => p.id === id);
        if (!found) setError("Producto no encontrado");
        else setProduct(found);
      })
      .catch(() => setError("Error al cargar el producto"))
      .finally(() => setLoading(false));
  }, [id, product]);

  if (loading)
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-rose-300">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-100 border-t-rose-400" />
        <p className="text-sm font-medium">Cargando producto...</p>
      </div>
    );

  if (error || !product)
    return (
      <div className="mx-auto max-w-sm rounded-2xl bg-red-50 p-10 text-center">
        <p className="text-3xl">😕</p>
        <p className="mt-3 font-semibold text-red-500">{error ?? "Producto no encontrado"}</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-4 text-sm text-rose-400 underline"
        >
          Volver al menú
        </button>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-6 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
        >
          <path
            fillRule="evenodd"
            d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
            clipRule="evenodd"
          />
        </svg>
        Volver al menú
      </button>

      <div className="bg-background3 rounded-2xl overflow-hidden border border-border-subtle shadow-sm">
        {/* Product image */}
        <div className="relative h-64 w-full bg-rose-50 overflow-hidden">
          <img
            src={product.imageUrl || productPlaceholder}
            alt={product.name}
            onError={(e) => { e.currentTarget.src = productPlaceholder; }}
            className="h-full w-full object-cover"
          />
          {product.isCustom && (
            <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow">
              Personalizable
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col gap-6">
          {/* Category */}
          <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            {product.categoryName}
          </span>

          {/* Name & description */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-heading font-bold text-text-primary leading-tight">
              {product.name}
            </h1>
            {product.description && (
              <p className="text-base text-text-secondary leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-semibold text-primary">{product.currency}.</span>
              <span className="text-3xl font-bold text-primary">
                {(product.priceCents / 100).toFixed(2)}
              </span>
            </div>
            <AppButton
              onClick={() => {
                addToCart(product);
                navigate("/");
              }}
            >
              + Agregar al carrito
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  );
}
