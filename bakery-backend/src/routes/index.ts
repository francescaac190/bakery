import { Router } from "express";
import { env } from "../config/env";
import { adminOrdersRouter } from "../modules/adminOrders/adminOrders.routes";
import { menuRouter } from "../modules/menu/menu.routes";
import { ordersRouter } from "../modules/orders/orders.routes";

export const apiRouter = Router();

apiRouter.use(`${env.apiPrefix}/menu`, menuRouter);
apiRouter.use(`${env.apiPrefix}/orders`, ordersRouter);
apiRouter.use(`${env.apiPrefix}/admin`, adminOrdersRouter);
