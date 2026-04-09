import { Router } from "express";
import { env } from "../config/env";
import { authRouter } from "../modules/auth/auth.routes";
import { adminMenuRouter } from "../modules/menu/adminMenu.routes";
import { adminOrdersRouter } from "../modules/adminOrders/adminOrders.routes";
import { adminUsersRouter } from "../modules/adminUsers/adminUsers.routes";
import { uploadRouter } from "../modules/upload/upload.routes";
import { dashboardRouter } from "../modules/dashboard/dashboard.routes";
import { menuRouter } from "../modules/menu/menu.routes";
import { ordersRouter } from "../modules/orders/orders.routes";
import { authenticate } from "../shared/middleware/authenticate";

export const apiRouter = Router();

// Public routes
apiRouter.use(`${env.apiPrefix}/menu`, menuRouter);
apiRouter.use(`${env.apiPrefix}/orders`, ordersRouter);
apiRouter.use(`${env.apiPrefix}/auth`, authRouter);

// Protected admin routes — authenticate applied to entire admin router
const adminRouter = Router();
adminRouter.use(authenticate);
adminRouter.use("/orders", adminOrdersRouter);
adminRouter.use("/menu", adminMenuRouter);
adminRouter.use("/users", adminUsersRouter);
adminRouter.use("/upload", uploadRouter);
adminRouter.use("/dashboard", dashboardRouter);

apiRouter.use(`${env.apiPrefix}/admin`, adminRouter);
