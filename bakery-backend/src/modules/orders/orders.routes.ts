import { Router } from "express";
import { ordersController } from "./orders.controller";

export const ordersRouter = Router();

ordersRouter.post("/", ordersController.createOrder);
ordersRouter.get("/:id", ordersController.getOrderById);
