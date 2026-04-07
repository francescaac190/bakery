import type { Request, Response } from "express";
import { sendSuccess } from "../../shared/http/response";
import {
  createCategorySchema,
  createProductSchema,
  getProductsQuerySchema,
  menuItemParamsSchema,
  updateCategorySchema,
  updateProductSchema,
} from "./menu.schemas";
import { menuService } from "./menu.service";

async function getCategories(_req: Request, res: Response) {
  const categories = await menuService.getAllCategories();
  return sendSuccess(res, categories);
}

async function getProducts(req: Request, res: Response) {
  const query = getProductsQuerySchema.parse(req.query);
  const products = await menuService.getAllProducts(query);
  return sendSuccess(res, products);
}

async function createProduct(req: Request, res: Response) {
  const body = createProductSchema.parse(req.body);
  const product = await menuService.createProduct(body);
  return sendSuccess(res, product, 201);
}

async function updateProduct(req: Request, res: Response) {
  const { id } = menuItemParamsSchema.parse(req.params);
  const body = updateProductSchema.parse(req.body);
  const product = await menuService.updateProduct(id, body);
  return sendSuccess(res, product);
}

async function deleteProduct(req: Request, res: Response) {
  const { id } = menuItemParamsSchema.parse(req.params);
  await menuService.deleteProduct(id);
  res.status(204).send();
}

async function createCategory(req: Request, res: Response) {
  const body = createCategorySchema.parse(req.body);
  const category = await menuService.createCategory(body);
  return sendSuccess(res, category, 201);
}

async function updateCategory(req: Request, res: Response) {
  const { id } = menuItemParamsSchema.parse(req.params);
  const body = updateCategorySchema.parse(req.body);
  const category = await menuService.updateCategory(id, body);
  return sendSuccess(res, category);
}

async function deleteCategory(req: Request, res: Response) {
  const { id } = menuItemParamsSchema.parse(req.params);
  await menuService.deleteCategory(id);
  res.status(204).send();
}

export const adminMenuController = {
  getCategories,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
};
