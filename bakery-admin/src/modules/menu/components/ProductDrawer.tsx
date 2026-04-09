// src/modules/menu/components/ProductDrawer.tsx
import { useEffect, useState } from 'react'
import { X, ImagePlus } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { uploadImage } from '../api/menu.api'
import { useCategories } from '../hooks/useCategories'
import { useCreateProduct, useUpdateProduct } from '../hooks/useProducts'
import type { CreateProductInput, Product, UpdateProductInput, VariantInput } from '../types'

interface Props {
  mode: 'create' | 'edit'
  product: Product | null
  onClose: () => void
}

export function ProductDrawer({ mode, product, onClose }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState('')
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('BOB')
  const [categoryId, setCategoryId] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isCustom, setIsCustom] = useState(false)
  const [variants, setVariants] = useState<VariantInput[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const { data: categories } = useCategories()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const isPending = isUploading || createProduct.isPending || updateProduct.isPending

  useEffect(() => {
    if (mode === 'edit' && product) {
      setName(product.name)
      setDescription(product.description ?? '')
      setExistingImageUrl(product.imageUrl ?? '')
      setPrice((product.priceCents / 100).toFixed(2))
      setCurrency(product.currency)
      setCategoryId(product.categoryId ?? '')
      setIsActive(product.isActive)
      setIsCustom(product.isCustom)
      setVariants(
        (product.variants ?? []).map(v => ({
          id: v.id,
          label: v.label,
          priceCents: v.priceCents,
          sortOrder: v.sortOrder,
          isActive: v.isActive,
        }))
      )
    } else {
      setName('')
      setDescription('')
      setExistingImageUrl('')
      setPrice('')
      setCurrency('BOB')
      setCategoryId('')
      setIsActive(true)
      setIsCustom(false)
      setVariants([])
    }
    setImageFile(null)
  }, [mode, product])

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile)
      setPreviewSrc(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewSrc(existingImageUrl || null)
    }
  }, [imageFile, existingImageUrl])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && !isPending) onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, isPending])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const priceCents = Math.round(parseFloat(price) * 100 + Number.EPSILON)
    if (isNaN(priceCents) || priceCents <= 0) {
      toast.error('El precio debe ser mayor a cero')
      return
    }

    setIsUploading(true)
    try {
      let imageUrl = existingImageUrl
      if (imageFile) imageUrl = await uploadImage(imageFile)

      const variantsPayload = variants.length > 0 ? variants : undefined

      if (mode === 'create') {
        const input: CreateProductInput = {
          name: name.trim(),
          priceCents,
          currency,
          isActive,
          isCustom,
          ...(description.trim() ? { description: description.trim() } : {}),
          ...(imageUrl ? { imageUrl } : {}),
          ...(categoryId ? { categoryId } : {}),
          ...(variantsPayload ? { variants: variantsPayload } : {}),
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
          imageUrl: imageUrl || null,
          categoryId: categoryId || null,
          variants: variants,
        }
        updateProduct.mutate({ id: product.id, input }, { onSuccess: onClose })
      }
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setIsUploading(false)
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

          {/* Image upload */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Imagen
            </label>
            {previewSrc && (
              <div className="w-full h-36 rounded-md overflow-hidden border border-border-card">
                <img src={previewSrc} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <label className="flex flex-col items-center justify-center gap-1.5 w-full py-4 border-2 border-dashed border-border-card rounded-md cursor-pointer hover:border-primary transition-colors bg-background-3">
              <ImagePlus size={18} className="text-text-muted" />
              <span className="text-xs text-text-muted">
                {imageFile ? imageFile.name : previewSrc ? 'Cambiar imagen' : 'Seleccionar imagen'}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => setImageFile(e.target.files?.[0] ?? null)}
              />
            </label>
            {(imageFile || existingImageUrl) && (
              <button
                type="button"
                onClick={() => { setImageFile(null); setExistingImageUrl('') }}
                className="text-xs text-text-muted hover:text-secondary transition-colors text-left"
              >
                Quitar imagen
              </button>
            )}
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

          {/* Variants */}
          {!isCustom && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Variantes de tamaño
              </label>
              {variants.map((v, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    placeholder="Ej: 10 personas"
                    value={v.label}
                    onChange={(e) => {
                      const next = [...variants]
                      next[i] = { ...next[i], label: e.target.value }
                      setVariants(next)
                    }}
                    className="flex-1 border border-border-card rounded-md px-2 py-1.5 text-sm bg-background-3 text-text focus:outline-none focus:border-primary"
                  />
                  <input
                    type="number"
                    placeholder="Precio Bs."
                    value={v.priceCents ? (v.priceCents / 100).toFixed(2) : ''}
                    onChange={(e) => {
                      const next = [...variants]
                      next[i] = { ...next[i], priceCents: Math.round(parseFloat(e.target.value || '0') * 100) }
                      setVariants(next)
                    }}
                    step="0.01"
                    min="0"
                    className="w-24 border border-border-card rounded-md px-2 py-1.5 text-sm bg-background-3 text-text focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setVariants(variants.filter((_, j) => j !== i))}
                    className="text-secondary text-sm hover:text-red-700 transition-colors px-1"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setVariants([...variants, { label: '', priceCents: 0, sortOrder: variants.length, isActive: true }])
                }
                className="text-xs text-primary hover:underline text-left"
              >
                + Agregar variante
              </button>
            </div>
          )}

          {/* Submit */}
          <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-border-subtle">
            <Button type="submit" disabled={isPending} className="w-full justify-center">
              {isUploading ? 'Subiendo imagen...' : isPending ? 'Guardando...' : mode === 'create' ? 'Crear producto' : 'Guardar cambios'}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose} disabled={isPending} className="w-full justify-center">
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
