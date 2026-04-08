export type GetProductsFilters = {
  categoryId?: string;
  search?: string;
};

export type CreateCategoryInput = {
  name: string;
  imageUrl?: string;
};

export type VariantInput = {
  id?: string;
  label: string;
  priceCents: number;
  sortOrder: number;
  isActive: boolean;
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
  variants?: VariantInput[];
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
  variants?: VariantInput[];
};

export type UpdateCategoryInput = {
  name?: string;
  imageUrl?: string | null;
};
