import { Router } from "express";
import { menuController } from "./menu.controller";

export const menuRouter = Router();

menuRouter.get("/categories", menuController.getCategories);
menuRouter.get("/products", menuController.getProducts);
