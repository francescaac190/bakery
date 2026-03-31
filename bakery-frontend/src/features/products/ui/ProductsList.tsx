import { useNavigate } from "react-router-dom";
import { useProducts } from "../hooks";
import type { Product } from "../types";
import productPlaceholder from "../../../assets/product-placeholder.svg";
import { AppButton } from "../../../components/ui/AppButton";

type ProductsListProps = {
  onAddToCart: (product: Product) => void;
};

export function ProductsList({ onAddToCart }: ProductsListProps) {
  const { status, data, error, isLoading, isError, isSuccess } = useProducts();
  const navigate = useNavigate();

  if (status === "idle" || isLoading)
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-rose-300">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-100 border-t-rose-400" />
        <p className="text-sm font-medium">Cargando productos...</p>
      </div>
    );

  if (isError)
    return (
      <div className="mx-auto max-w-sm rounded-2xl bg-red-50 p-10 text-center">
        <p className="text-3xl">😕</p>
        <p className="mt-3 font-semibold text-red-500">
          Error al cargar los productos
        </p>
        <p className="mt-1 text-sm text-red-400">{error}</p>
      </div>
    );

  if (!isSuccess || !data)
    return (
      <div className="py-24 text-center text-rose-300">
        <p className="text-3xl">🍰</p>
        <p className="mt-2 text-sm font-medium">No hay productos disponibles</p>
      </div>
    );

  return (
    <div className="bg-background3 rounded-2xl p-8 mb-4 space-y-4">
      <ul className="flex flex-col gap-4">
        {data.map((product) => (
          <li
            key={product.id}
            onClick={() =>
              navigate(`/products/${product.id}`, { state: { product } })
            }
            className="group flex gap-5 overflow-hidden rounded-2xl border border-transparent bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-50 hover:shadow-md cursor-pointer"
          >
            <div className="flex flex-col">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-rose-50">
                <img
                  src={product.imageUrl || productPlaceholder}
                  alt={product.name}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = productPlaceholder;
                  }}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              {product.isCustom && (
                <span className="rounded-full bg-secondary px-2 py-0.5 mt-1 text-xs font-semibold text-white shadow-sm">
                  Personalizable
                </span>
              )}
            </div>

            <div className="flex flex-1 items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <h2 className="font-display text-md font-mono leading-tight text-stone-800">
                  {product.name}
                </h2>
                {product.description && (
                  <p className="line-clamp-2 text-sm font-mono leading-relaxed text-stone-400">
                    {product.description}
                  </p>
                )}
                <div className="inline-flex items-baseline gap-0.5 self-start">
                  <span className="text-xs font-semibold text-secondary">
                    {product.currency}.
                  </span>
                  <span className="text-md font-bold text-secondary">
                    {(product.priceCents / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              <div
                className="flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <AppButton
                  onClick={
                    product.isCustom
                      ? () => navigate("/personaliza", { state: { product } })
                      : () => onAddToCart(product)
                  }
                >
                  {product.isCustom ? "✦ Personalizar" : "+ Agregar"}
                </AppButton>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
