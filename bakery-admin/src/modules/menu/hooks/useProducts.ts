import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { menuApi } from '../api/menu.api'
import type { CreateProductInput, ProductFilters, UpdateProductInput } from '../types'

export const PRODUCTS_KEY = ['admin', 'products'] as const

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, filters.categoryId ?? null, filters.search ?? null],
    queryFn: () => menuApi.getProducts(filters),
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateProductInput) => menuApi.createProduct(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
      toast.success('Producto creado')
    },
    onError: (err: Error) => toast.error(err.message ?? 'Ha ocurrido un error'),
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProductInput }) =>
      menuApi.updateProduct(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
      toast.success('Producto actualizado')
    },
    onError: (err: Error) => toast.error(err.message ?? 'Ha ocurrido un error'),
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => menuApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
      toast.success('Producto eliminado')
    },
    onError: (err: Error) => toast.error(err.message ?? 'Ha ocurrido un error'),
  })
}
