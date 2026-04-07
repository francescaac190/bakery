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
    createdAt: Date;
    updatedAt: Date;
}