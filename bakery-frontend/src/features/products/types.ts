export type ProductVariant = {
    id: string;
    label: string;
    priceCents: number;
    sortOrder: number;
};

export type Product = {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    priceCents: number;
    currency: string;
    isActive: boolean;
    isCustom: boolean;
    categoryId: string;
    categoryName?: string;
    categoryImageUrl?: string;
    variants?: ProductVariant[];
    createdAt: Date;
    updatedAt: Date;
}