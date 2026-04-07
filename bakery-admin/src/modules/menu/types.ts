// src/modules/menu/types.ts

export interface Category {
  id: string
  name: string
  imageUrl?: string | null
  products?: Product[]
}

export interface Product {
  id: string
  name: string
  description?: string | null
  imageUrl?: string | null
  priceCents: number
  currency: string
  isActive: boolean
  isCustom: boolean
  categoryId?: string | null
  category?: Category | null
}

export interface ProductFilters {
  categoryId?: string
  search?: string
}

export interface CreateCategoryInput {
  name: string
  imageUrl?: string
}

export interface UpdateCategoryInput {
  name?: string
  imageUrl?: string | null
}

export interface CreateProductInput {
  name: string
  description?: string
  imageUrl?: string
  priceCents: number
  currency: string
  isActive: boolean
  isCustom: boolean
  categoryId?: string
}

export interface UpdateProductInput {
  name?: string
  description?: string | null
  imageUrl?: string | null
  priceCents?: number
  currency?: string
  isActive?: boolean
  isCustom?: boolean
  categoryId?: string | null
}
