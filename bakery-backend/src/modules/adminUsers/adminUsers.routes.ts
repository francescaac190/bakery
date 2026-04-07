import { Router } from "express";
import { requireRole } from "../../shared/middleware/requireRole";
import { adminUsersController } from "./adminUsers.controller";

export const adminUsersRouter = Router();

adminUsersRouter.use(requireRole("SUPER_ADMIN"));

adminUsersRouter.get("/", adminUsersController.listUsers);
adminUsersRouter.post("/", adminUsersController.createUser);
adminUsersRouter.patch("/:id", adminUsersController.updateUser);
adminUsersRouter.delete("/:id", adminUsersController.deleteUser);
