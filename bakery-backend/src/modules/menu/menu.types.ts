export type GetProductsFilters = {
  categoryId?: string;
  search?: string;
};

export type CreateCategoryInput = {
  name: string;
  imageUrl?: string;
};

export type CreateProductInput = {
  name: string;
  description?: string;
  imageUrl?: string;
  priceCents: number;
  currency: string;
  isActive: boolean;
  isCustom: boolean;
  categoryId?: string;
};

export type UpdateProductInput = {
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
  priceCents?: number;
  currency?: string;
  isActive?: boolean;
  isCustom?: boolean;
  categoryId?: string | null;
};

export type UpdateCategoryInput = {
  name?: string;
  imageUrl?: string | null;
};
