import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { useCategories } from '../hooks/useCategories'
import { useCreateProduct, useUpdateProduct } from '../hooks/useProducts'
import type { CreateProductInput, Product, UpdateProductInput } from '../types'

interface Props {
  mode: 'create' | 'edit'
  product: Product | null
  onClose: () => void
}

export function ProductDrawer({ mode, product, onClose }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('BOB')
  const [categoryId, setCategoryId] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isCustom, setIsCustom] = useState(false)

  const { data: categories } = useCategories()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const isPending = createProduct.isPending || updateProduct.isPending

  useEffect(() => {
    if (mode === 'edit' && product) {
      setName(product.name)
      setDescription(product.description ?? '')
      setImageUrl(product.imageUrl ?? '')
      setPrice((product.priceCents / 100).toFixed(2))
      setCurrency(product.currency)
      setCategoryId(product.categoryId ?? '')
      setIsActive(product.isActive)
      setIsCustom(product.isCustom)
    } else {
      setName('')
      setDescription('')
      setImageUrl('')
      setPrice('')
      setCurrency('BOB')
      setCategoryId('')
      setIsActive(true)
      setIsCustom(false)
    }
  }, [mode, product])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && !isPending) onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, isPending])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const priceCents = Math.round((parseFloat(price) + Number.EPSILON) * 100)
    if (isNaN(priceCents) || priceCents <= 0) {
      toast.error('El precio debe ser mayor a cero')
      return
    }

    if (mode === 'create') {
      const input: CreateProductInput = {
        name: name.trim(),
        priceCents,
        currency,
        isActive,
        isCustom,
        ...(description.trim() ? { description: description.trim() } : {}),
        ...(imageUrl.trim() ? { imageUrl: imageUrl.trim() } : {}),
        ...(categoryId ? { categoryId } : {}),
      }
      createProduct.mutate(input, { onSuccess: onClose })
    } else if (product) {
      const input: UpdateProductInput = {
        name: name.trim(),
        priceCents,
        currency,
        isActive,
        isCustom,
        description: description.trim() || null,
        imageUrl: imageUrl.trim() || null,
        categoryId: categoryId || null,
      }
      updateProduct.mutate({ id: product.id, input }, { onSuccess: onClose })
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={() => !isPending && onClose()} />

      <div className="fixed inset-y-0 right-0 w-96 bg-surface border-l-2 border-border-subtle shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h2 className="text-base font-semibold text-text-heading">
            {mode === 'create' ? 'Nuevo Producto' : 'Editar Producto'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-text-muted hover:text-text transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 px-6 py-4 gap-4 overflow-y-auto">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Nombre <span className="text-secondary">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              maxLength={120}
              placeholder="Ej: Torta de chocolate"
              className="w-full border border-border-card rounded-md px-3 py-2 text-sm bg-background-3 text-text focus:outline-none focus:border-primary"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Descripción opcional..."
              className="w-full border border-border-card rounded-md px-3 py-2 text-sm bg-background-3 text-text focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {/* Image URL */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              URL de imagen
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full border border-border-card rounded-md px-3 py-2 text-sm bg-background-3 text-text focus:outline-none focus:border-primary"
            />
          </div>

          {/* Price + Currency */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Precio (Bs.) <span className="text-secondary">*</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
                min="0.01"
                step="0.01"
                placeholder="25.00"
                className="w-full border border-border-card rounded-md px-3 py-2 text-sm bg-background-3 text-text focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Moneda
              </label>
              <input
                type="text"
                value={currency}
                onChange={e => setCurrency(e.target.value.toUpperCase())}
                maxLength={3}
                className="w-full border border-border-card rounded-md px-3 py-2 text-sm bg-background-3 text-text focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Categoría
            </label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full border border-border-card rounded-md px-3 py-2 text-sm bg-background-3 text-text focus:outline-none focus:border-primary"
            >
              <option value="">Sin categoría</option>
              {categories?.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Activo</span>
              <button
                type="button"
                onClick={() => setIsActive(v => !v)}
                className={`w-10 h-5 rounded-full transition-colors relative ${isActive ? 'bg-primary' : 'bg-border-subtle'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Personalizado</span>
              <button
                type="button"
                onClick={() => setIsCustom(v => !v)}
                className={`w-10 h-5 rounded-full transition-colors relative ${isCustom ? 'bg-primary' : 'bg-border-subtle'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isCustom ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-border-subtle">
            <Button type="submit" disabled={isPending} className="w-full justify-center">
              {isPending ? 'Guardando...' : mode === 'create' ? 'Crear producto' : 'Guardar cambios'}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose} className="w-full justify-center">
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
