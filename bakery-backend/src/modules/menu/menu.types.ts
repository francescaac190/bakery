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
