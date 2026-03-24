import type { Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import { createCategorySchema, createProductSchema, getProductsQuerySchema } from "./menu.schemas";
import { menuService } from "./menu.service";

async function getCategories(_req: Request, res: Response) {
  const categories = await menuService.getCategories();
  return sendSuccess(res, categories);
}

async function getProducts(req: Request, res: Response) {
  const query = getProductsQuerySchema.parse(req.query);
  const products = await menuService.getProducts(query);
  return sendSuccess(res, products);
}

async function createCategory(req: Request, res: Response) {
  const body = createCategorySchema.parse(req.body);
  const category = await menuService.createCategory(body);
  return sendSuccess(res, category, 201);
}

async function createProduct(req: Request, res: Response) {
  const body = createProductSchema.parse(req.body);
  const product = await menuService.createProduct(body);
  return sendSuccess(res, product, 201);
}

export const menuController = {
  getCategories,
  getProducts,
  createCategory,
  createProduct,
};
