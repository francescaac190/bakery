import { Router } from "express";
import { menuController } from "./menu.controller";

export const menuRouter = Router();

menuRouter.get("/categories", menuController.getCategories);
menuRouter.post("/categories", menuController.createCategory);
menuRouter.get("/products", menuController.getProducts);
menuRouter.post("/products", menuController.createProduct);
