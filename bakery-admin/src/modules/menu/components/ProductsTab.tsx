import { useState, useEffect } from 'react'
import { Pencil, Trash2, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { useDeleteProduct, useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { ProductDrawer } from './ProductDrawer'
import type { Product } from '../types'

type DrawerMode = 'create' | 'edit' | null

export function ProductsTab() {
  const user = useAuthStore(state => state.user)
  const isSuperAdmin = user?.role === 'SUPER_ADMIN'

  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data: products, isLoading, error } = useProducts({
    search: debouncedSearch || undefined,
    categoryId: categoryId || undefined,
  })
  const { data: categories } = useCategories()
  const deleteProduct = useDeleteProduct()

  function openCreate() {
    setSelectedProduct(null)
    setDrawerMode('create')
  }

  function openEdit(product: Product) {
    setSelectedProduct(product)
    setDrawerMode('edit')
  }

  function closeDrawer() {
    setDrawerMode(null)
    setSelectedProduct(null)
  }

  function handleDelete(product: Product) {
    if (!window.confirm(`¿Desactivar el producto "${product.name}"? El producto quedará inactivo y no aparecerá en el menú.`)) return
    setDeletingId(product.id)
    deleteProduct.mutate(product.id, {
      onSettled: () => setDeletingId(null),
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 gap-3 text-text-muted text-sm">
        <div className="w-5 h-5 border-2 border-border-subtle border-t-primary rounded-full animate-spin" />
        Cargando productos...
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4 text-sm text-secondary">
        <p className="font-medium">No se pudieron cargar los productos.</p>
        <p className="text-xs mt-1">{(error as Error).message}</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar producto..."
              className="w-full border border-border-card rounded-md pl-8 pr-3 py-2 text-sm bg-background-3 text-text focus:outline-none focus:border-primary"
            />
          </div>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="border border-border-card rounded-md px-3 py-2 text-sm bg-background-3 text-text focus:outline-none focus:border-primary"
          >
            <option value="">Todas las categorías</option>
            {categories?.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {isSuperAdmin && (
            <Button onClick={openCreate} size="sm">
              <Plus size={14} />
              Agregar Producto
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="border border-border-card rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-background-4 text-text-heading">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Nombre</th>
                <th className="text-left px-4 py-3 font-semibold">Categoría</th>
                <th className="text-left px-4 py-3 font-semibold">Precio</th>
                <th className="text-left px-4 py-3 font-semibold">Estado</th>
                {isSuperAdmin && (
                  <th className="text-right px-4 py-3 font-semibold">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {products?.length === 0 && (
                <tr>
                  <td
                    colSpan={isSuperAdmin ? 5 : 4}
                    className="px-4 py-8 text-center text-text-muted text-xs"
                  >
                    No hay productos.{search || categoryId ? ' Prueba con otros filtros.' : ' Crea el primero.'}
                  </td>
                </tr>
              )}
              {products?.map(product => (
                <tr
                  key={product.id}
                  className={`transition-colors hover:bg-background-2 ${!product.isActive ? 'opacity-60' : ''}`}
                >
                  <td className="px-4 py-3 font-medium text-text-heading">{product.name}</td>
                  <td className="px-4 py-3 text-text-muted">{product.category?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-text">
                    {product.currency} {(product.priceCents / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      product.isActive
                        ? 'bg-success-bg text-success-text'
                        : 'bg-background-4 text-text-muted'
                    }`}>
                      {product.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  {isSuperAdmin && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          disabled={deletingId === product.id}
                          className="p-1.5 text-text-muted hover:text-primary rounded transition-colors disabled:opacity-50"
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product.id}
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
        <ProductDrawer
          mode={drawerMode}
          product={selectedProduct}
          onClose={closeDrawer}
        />
      )}
    </>
  )
}
