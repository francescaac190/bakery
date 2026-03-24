import { useState } from "react";
import { useProducts } from "../hooks";
import type { Product } from "../types";
import productPlaceholder from "../../../assets/product-placeholder.svg";
import { AppButton } from "../../../components/ui/AppButton";
import { Modal } from "../../../components/ui/Modal";

type ProductsListProps = {
  onAddToCart: (product: Product) => void;
};

export function ProductsList({ onAddToCart }: ProductsListProps) {
  const { status, data, error, isLoading, isError, isSuccess } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const closeModal = () => setSelectedProduct(null);

  const confirmAddProduct = () => {
    if (!selectedProduct) return;
    onAddToCart(selectedProduct);
    setSelectedProduct(null);
  };

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
        <p className="mt-3 font-semibold text-red-500">Error al cargar los productos</p>
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
    <>
      <ul className="flex flex-col gap-4">
        {data.map((product) => (
          <li
            key={product.id}
            className="group flex gap-5 overflow-hidden rounded-2xl border border-transparent bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-50 hover:shadow-md"
          >
            <div className="relative h-36 w-36 flex-shrink-0 overflow-hidden rounded-xl bg-rose-50">
              <img
                src={product.imageUrl || productPlaceholder}
                alt={product.name}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src = productPlaceholder;
                }}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {product.isCustom && (
                <span className="absolute left-2 top-2 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
                  Personalizable
                </span>
              )}
            </div>

            <div className="flex flex-1 items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-widest text-rose-300">
                  {product.categoryName}
                </span>
                <h2 className="font-display text-xl font-semibold leading-tight text-stone-800">
                  {product.name}
                </h2>
                {product.description && (
                  <p className="line-clamp-2 text-sm leading-relaxed text-stone-400">
                    {product.description}
                  </p>
                )}
                <div className="mt-1 inline-flex items-baseline gap-0.5 self-start rounded-full bg-rose-50 px-3 py-1">
                  <span className="text-xs font-semibold text-rose-400">{product.currency}.</span>
                  <span className="text-lg font-bold text-rose-600">
                    {(product.priceCents / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <AppButton
                  onClick={
                    product.isCustom
                      ? () => setSelectedProduct(product)
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

      <Modal
        isOpen={selectedProduct !== null}
        onClose={closeModal}
        onConfirm={confirmAddProduct}
        title="Confirmar pedido"
        description={
          selectedProduct
            ? `Deseas agregar "${selectedProduct.name}" al carrito?`
            : undefined
        }
        showCakeForm={selectedProduct?.isCustom ?? false}
        confirmText="Agregar"
        cancelText="Cancelar"
      />
    </>
  );
}
