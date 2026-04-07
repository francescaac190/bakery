import type { Request, Response } from "express";
import type { AdminRole } from "@prisma/client";
import { sendSuccess } from "../../shared/http/response";
import {
  adminUserParamsSchema,
  createAdminUserSchema,
  updateAdminUserSchema,
} from "./adminUsers.schemas";
import { adminUsersService } from "./adminUsers.service";

async function listUsers(_req: Request, res: Response) {
  const users = await adminUsersService.listUsers();
  return sendSuccess(res, users);
}

async function createUser(req: Request, res: Response) {
  const body = createAdminUserSchema.parse(req.body);
  const user = await adminUsersService.createUser({
    ...body,
    role: body.role as AdminRole,
  });
  return sendSuccess(res, user, 201);
}

async function updateUser(req: Request, res: Response) {
  const { id } = adminUserParamsSchema.parse(req.params);
  const body = updateAdminUserSchema.parse(req.body);
  const user = await adminUsersService.updateUser(id, {
    ...body,
    role: body.role as AdminRole | undefined,
  });
  return sendSuccess(res, user);
}

async function deleteUser(req: Request, res: Response) {
  const { id } = adminUserParamsSchema.parse(req.params);
  await adminUsersService.deleteUser(id, req.admin!.id);
  res.status(204).send();
}

export const adminUsersController = {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
};
