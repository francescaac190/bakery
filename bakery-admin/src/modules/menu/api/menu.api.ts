import { useAuthStore } from '@/modules/auth/store/auth.store'
import type {
  Category,
  Product,
  ProductFilters,
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateProductInput,
  UpdateProductInput,
} from '../types'

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'}/admin/menu`

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

async function expectNoContent(res: Response): Promise<void> {
  if (!res.ok) {
    const json = await res.json().catch(() => ({}))
    throw new Error(
      (json as { error?: { message?: string } })?.error?.message ?? `Error ${res.status}`
    )
  }
}

export const menuApi = {
  getProducts: (filters: ProductFilters = {}): Promise<Product[]> => {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.categoryId) params.set('categoryId', filters.categoryId)
    return fetch(`${BASE_URL}/products?${params}`, { headers: authHeaders() })
      .then(res => parseJson<Product[]>(res))
  },

  getCategories: (): Promise<Category[]> =>
    fetch(`${BASE_URL}/categories`, { headers: authHeaders() })
      .then(res => parseJson<Category[]>(res)),

  createProduct: (input: CreateProductInput): Promise<Product> =>
    fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(input),
    }).then(res => parseJson<Product>(res)),

  updateProduct: (id: string, input: UpdateProductInput): Promise<Product> =>
    fetch(`${BASE_URL}/products/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(input),
    }).then(res => parseJson<Product>(res)),

  deleteProduct: (id: string): Promise<void> =>
    fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(expectNoContent),

  createCategory: (input: CreateCategoryInput): Promise<Category> =>
    fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(input),
    }).then(res => parseJson<Category>(res)),

  updateCategory: (id: string, input: UpdateCategoryInput): Promise<Category> =>
    fetch(`${BASE_URL}/categories/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(input),
    }).then(res => parseJson<Category>(res)),

  deleteCategory: (id: string): Promise<void> =>
    fetch(`${BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(expectNoContent),
}
