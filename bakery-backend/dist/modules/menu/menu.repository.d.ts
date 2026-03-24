import type { CreateCategoryInput, CreateProductInput, GetProductsFilters } from "./menu.types";
declare function findCategoriesWithActiveProducts(): Promise<({
    products: {
        id: string;
        name: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        priceCents: number;
        currency: string;
        isActive: boolean;
        isCustom: boolean;
        categoryId: string | null;
    }[];
} & {
    id: string;
    name: string;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
})[]>;
declare function findActiveProducts(filters: GetProductsFilters): Promise<({
    category: {
        id: string;
        name: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null;
} & {
    id: string;
    name: string;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    priceCents: number;
    currency: string;
    isActive: boolean;
    isCustom: boolean;
    categoryId: string | null;
})[]>;
declare function createCategory(data: CreateCategoryInput): Promise<{
    id: string;
    name: string;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
declare function createProduct(data: CreateProductInput): Promise<{
    category: {
        id: string;
        name: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null;
} & {
    id: string;
    name: string;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    priceCents: number;
    currency: string;
    isActive: boolean;
    isCustom: boolean;
    categoryId: string | null;
}>;
export declare const menuRepository: {
    findCategoriesWithActiveProducts: typeof findCategoriesWithActiveProducts;
    findActiveProducts: typeof findActiveProducts;
    createCategory: typeof createCategory;
    createProduct: typeof createProduct;
};
export {};
//# sourceMappingURL=menu.repository.d.ts.map