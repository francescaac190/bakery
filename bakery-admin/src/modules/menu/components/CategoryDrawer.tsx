import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCreateCategory, useUpdateCategory } from '../hooks/useCategories'
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../types'

interface Props {
  mode: 'create' | 'edit'
  category: Category | null
  onClose: () => void
}

export function CategoryDrawer({ mode, category, onClose }: Props) {
  const [name, setName] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const isPending = createCategory.isPending || updateCategory.isPending

  useEffect(() => {
    if (mode === 'edit' && category) {
      setName(category.name)
      setImageUrl(category.imageUrl ?? '')
    } else {
      setName('')
      setImageUrl('')
    }
  }, [mode, category])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedUrl = imageUrl.trim()

    if (mode === 'create') {
      const input: CreateCategoryInput = {
        name: name.trim(),
        ...(trimmedUrl ? { imageUrl: trimmedUrl } : {}),
      }
      createCategory.mutate(input, { onSuccess: onClose })
    } else if (category) {
      const input: UpdateCategoryInput = {
        name: name.trim(),
        imageUrl: trimmedUrl || null,
      }
      updateCategory.mutate({ id: category.id, input }, { onSuccess: onClose })
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-96 bg-surface border-l-2 border-border-subtle shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h2 className="text-base font-semibold text-text-heading">
            {mode === 'create' ? 'Nueva Categoría' : 'Editar Categoría'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 px-6 py-4 gap-4 overflow-y-auto">
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

          <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-border-subtle">
            <Button type="submit" disabled={isPending} className="w-full justify-center">
              {isPending ? 'Guardando...' : mode === 'create' ? 'Crear categoría' : 'Guardar cambios'}
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
