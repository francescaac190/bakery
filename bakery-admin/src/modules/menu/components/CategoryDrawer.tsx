// src/modules/menu/components/CategoryDrawer.tsx
import { useEffect, useState } from 'react'
import { X, ImagePlus } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { uploadImage } from '../api/menu.api'
import { useCreateCategory, useUpdateCategory } from '../hooks/useCategories'
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../types'

interface Props {
  mode: 'create' | 'edit'
  category: Category | null
  onClose: () => void
}

export function CategoryDrawer({ mode, category, onClose }: Props) {
  const [name, setName] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState('')
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const isPending = isUploading || createCategory.isPending || updateCategory.isPending

  useEffect(() => {
    if (mode === 'edit' && category) {
      setName(category.name)
      setExistingImageUrl(category.imageUrl ?? '')
    } else {
      setName('')
      setExistingImageUrl('')
    }
    setImageFile(null)
  }, [mode, category])

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
    setIsUploading(true)
    try {
      let imageUrl = existingImageUrl
      if (imageFile) imageUrl = await uploadImage(imageFile)

      if (mode === 'create') {
        const input: CreateCategoryInput = {
          name: name.trim(),
          ...(imageUrl ? { imageUrl } : {}),
        }
        createCategory.mutate(input, { onSuccess: onClose })
      } else if (category) {
        const input: UpdateCategoryInput = {
          name: name.trim(),
          imageUrl: imageUrl || null,
        }
        updateCategory.mutate({ id: category.id, input }, { onSuccess: onClose })
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
            {mode === 'create' ? 'Nueva Categoría' : 'Editar Categoría'}
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
              maxLength={80}
              placeholder="Ej: Tortas"
              className="w-full border border-border-card rounded-md px-3 py-2 text-sm bg-background-3 text-text focus:outline-none focus:border-primary"
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

          <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-border-subtle">
            <Button type="submit" disabled={isPending} className="w-full justify-center">
              {isUploading ? 'Subiendo imagen...' : isPending ? 'Guardando...' : mode === 'create' ? 'Crear categoría' : 'Guardar cambios'}
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
