import { useState } from 'react'
import { useProducts } from '../hooks'
import type { Product } from '../types'
import productPlaceholder from '../../../assets/product-placeholder.svg'
import { AppButton } from '../../../components/ui/AppButton'
import { Modal } from '../../../components/ui/Modal'

export function ProductsList() {
  const { status, data, error, isLoading, isError, isSuccess } = useProducts()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const closeModal = () => setSelectedProduct(null)
  const confirmAddProduct = () => {
    setSelectedProduct(null)
  }

  if (status === 'idle' || isLoading) return <div>Loading...</div>
  if (isError) return <p style={{ color: 'crimson' }}>Error: {error}</p>
  if (!isSuccess || !data) return <p>No products available.</p>

  return (
    <>
      <ul className="flex flex-col gap-6">
        {data.map((product) => (
          <li key={product.id} className="flex gap-5 rounded-xl bg-white p-4 shadow-sm">
            <img
              src={product.imageUrl || productPlaceholder}
              alt={product.name}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.src = productPlaceholder
              }}
              className="h-32 w-32 flex-shrink-0 rounded-xl object-cover"
            />
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col items-start justify-center gap-3 text-left">
                <h1 className="text-xl font-bold">{product.name}</h1>
                <p className="text-md">{product.description}</p>
                <div className="text-lg font-semibold text-red-400">
                  {product.currency}. {product.priceCents.toFixed(2)}
                </div>
              </div>
              <AppButton onClick={() => setSelectedProduct(product)}>Agregar</AppButton>
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
          selectedProduct ? `Deseas agregar "${selectedProduct.name}" al carrito?` : undefined
        }
        showCakeForm={true}
        confirmText="Agregar"
        cancelText="Cancelar"
      />
    </>
  )
}
