import type { CreateCategoryInput, CreateProductInput, GetProductsFilters } from "./menu.types";
declare function getCategories(): Promise<({
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
declare function getProducts(filters: GetProductsFilters): Promise<({
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
declare function createCategory(input: CreateCategoryInput): Promise<{
    id: string;
    name: string;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
declare function createProduct(input: CreateProductInput): Promise<{
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
export declare const menuService: {
    getCategories: typeof getCategories;
    getProducts: typeof getProducts;
    createCategory: typeof createCategory;
    createProduct: typeof createProduct;
};
export {};
//# sourceMappingURL=menu.service.d.ts.map