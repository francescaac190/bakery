import { z } from "zod";
export const getProductsQuerySchema = z.object({
    categoryId: z.string().trim().optional(),
    search: z.string().trim().optional(),
});
//# sourceMappingURL=menu.schemas.js.map