import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { ordersApi } from '../api/orders.api'
import type { OrderFilters, OrderStatus } from '../types'

export const ORDERS_KEY = ['admin', 'orders'] as const

export function useOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: [
      ...ORDERS_KEY,
      filters.status ?? null,
      filters.from ?? null,
      filters.to ?? null,
      filters.search ?? null,
      filters.page ?? 1,
      filters.pageSize ?? 20,
    ],
    queryFn: () => ordersApi.listOrders(filters),
  })
}

export function useOrder(id: string | null) {
  return useQuery({
    queryKey: [...ORDERS_KEY, id],
    queryFn: () => ordersApi.getOrder(id!),
    enabled: !!id,
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEY })
      toast.success('Estado actualizado')
    },
    onError: (err: Error) => toast.error(err.message ?? 'Ha ocurrido un error'),
  })
}

export function useUpdateAdminNotes() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, adminNotes }: { id: string; adminNotes: string }) =>
      ordersApi.updateAdminNotes(id, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEY })
      toast.success('Notas guardadas')
    },
    onError: (err: Error) => toast.error(err.message ?? 'Ha ocurrido un error'),
  })
}
