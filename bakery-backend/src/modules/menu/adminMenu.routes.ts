import { Router } from "express";
import { requireRole } from "../../shared/middleware/requireRole";
import { adminMenuController } from "./adminMenu.controller";

export const adminMenuRouter = Router();

// Both roles can read
adminMenuRouter.get("/products", adminMenuController.getProducts);
adminMenuRouter.get("/categories", adminMenuController.getCategories);

// SUPER_ADMIN only for writes
adminMenuRouter.post("/products", requireRole("SUPER_ADMIN"), adminMenuController.createProduct);
adminMenuRouter.patch("/products/:id", requireRole("SUPER_ADMIN"), adminMenuController.updateProduct);
adminMenuRouter.delete("/products/:id", requireRole("SUPER_ADMIN"), adminMenuController.deleteProduct);

adminMenuRouter.post("/categories", requireRole("SUPER_ADMIN"), adminMenuController.createCategory);
adminMenuRouter.patch("/categories/:id", requireRole("SUPER_ADMIN"), adminMenuController.updateCategory);
adminMenuRouter.delete("/categories/:id", requireRole("SUPER_ADMIN"), adminMenuController.deleteCategory);
