import { z } from "zod";
export declare const getProductsQuerySchema: z.ZodObject<{
    categoryId: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const createCategorySchema: z.ZodObject<{
    name: z.ZodString;
    imageUrl: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const createProductSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodString>;
    priceCents: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    isCustom: z.ZodDefault<z.ZodBoolean>;
    categoryId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=menu.schemas.d.ts.map