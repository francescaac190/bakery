import { useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { useCategories, useDeleteCategory } from '../hooks/useCategories'
import { CategoryDrawer } from './CategoryDrawer'
import type { Category } from '../types'

type DrawerMode = 'create' | 'edit' | null

export function CategoriesTab() {
  const user = useAuthStore(state => state.user)
  const isSuperAdmin = user?.role === 'SUPER_ADMIN'

  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data: categories, isLoading, error } = useCategories()
  const deleteCategory = useDeleteCategory()

  function openCreate() {
    setSelectedCategory(null)
    setDrawerMode('create')
  }

  function openEdit(category: Category) {
    setSelectedCategory(category)
    setDrawerMode('edit')
  }

  function closeDrawer() {
    setDrawerMode(null)
    setSelectedCategory(null)
  }

  function handleDelete(category: Category) {
    if (!window.confirm(`¿Eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`)) return
    setDeletingId(category.id)
    deleteCategory.mutate(category.id, {
      onSettled: () => setDeletingId(null),
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 gap-3 text-text-muted text-sm">
        <div className="w-5 h-5 border-2 border-border-subtle border-t-primary rounded-full animate-spin" />
        Cargando categorías...
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4 text-sm text-secondary">
        <p className="font-medium">No se pudieron cargar las categorías.</p>
        <p className="text-xs mt-1">{(error as Error).message}</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {isSuperAdmin && (
          <div className="flex justify-end">
            <Button onClick={openCreate} size="sm">
              <Plus size={14} />
              Agregar Categoría
            </Button>
          </div>
        )}

        <div className="border border-border-card rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-background-4 text-text-heading">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Nombre</th>
                <th className="text-left px-4 py-3 font-semibold">URL imagen</th>
                {isSuperAdmin && (
                  <th className="text-right px-4 py-3 font-semibold">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {categories?.length === 0 && (
                <tr>
                  <td
                    colSpan={isSuperAdmin ? 3 : 2}
                    className="px-4 py-8 text-center text-text-muted text-xs"
                  >
                    {isSuperAdmin ? 'No hay categorías. Crea la primera.' : 'No hay categorías.'}
                  </td>
                </tr>
              )}
              {categories?.map(category => (
                <tr key={category.id} className="hover:bg-background-2 transition-colors">
                  <td className="px-4 py-3 font-medium text-text-heading">{category.name}</td>
                  <td className="px-4 py-3 text-text-muted text-xs truncate max-w-xs">
                    {category.imageUrl ?? '—'}
                  </td>
                  {isSuperAdmin && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(category)}
                          disabled={deletingId === category.id}
                          className="p-1.5 text-text-muted hover:text-primary rounded transition-colors disabled:opacity-50"
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(category)}
                          disabled={deletingId === category.id}
                          className="p-1.5 text-text-muted hover:text-secondary rounded transition-colors disabled:opacity-50"
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {drawerMode && (
        <CategoryDrawer
          mode={drawerMode}
          category={selectedCategory}
          onClose={closeDrawer}
        />
      )}
    </>
  )
}
