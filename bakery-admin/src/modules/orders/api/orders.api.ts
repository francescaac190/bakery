import { useAuthStore } from '@/modules/auth/store/auth.store'
import type { OrderDetail, OrderFilters, OrdersListResponse, OrderStatus } from '../types'

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:1313/api/v1'}/admin/orders`

function authHeaders() {
  const token = useAuthStore.getState().token
  if (!token) throw new Error('Not authenticated')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

async function parseJson<T>(res: Response): Promise<T> {
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(
      (json as { error?: { message?: string } })?.error?.message ?? `Error ${res.status}`
    )
  }
  return (json as { data: T }).data
}

export const ordersApi = {
  listOrders: (filters: OrderFilters = {}): Promise<OrdersListResponse> => {
    const params = new URLSearchParams()
    if (filters.status) params.set('status', filters.status)
    if (filters.from) params.set('from', filters.from)
    if (filters.to) params.set('to', filters.to)
    if (filters.search) params.set('search', filters.search)
    if (filters.page) params.set('page', String(filters.page))
    if (filters.pageSize) params.set('pageSize', String(filters.pageSize))
    return fetch(`${BASE_URL}?${params}`, { headers: authHeaders() })
      .then(res => parseJson<OrdersListResponse>(res))
  },

  getOrder: (id: string): Promise<OrderDetail> =>
    fetch(`${BASE_URL}/${id}`, { headers: authHeaders() })
      .then(res => parseJson<OrderDetail>(res)),

  updateStatus: (id: string, status: OrderStatus): Promise<OrderDetail> =>
    fetch(`${BASE_URL}/${id}/status`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    }).then(res => parseJson<OrderDetail>(res)),

  updateAdminNotes: (id: string, adminNotes: string): Promise<OrderDetail> =>
    fetch(`${BASE_URL}/${id}/notes`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ adminNotes }),
    }).then(res => parseJson<OrderDetail>(res)),
}
