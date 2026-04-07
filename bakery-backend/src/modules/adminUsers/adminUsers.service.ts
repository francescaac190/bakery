import bcrypt from "bcrypt";
import type { AdminRole } from "@prisma/client";
import { AppError } from "../../shared/errors/app-error";
import { adminUsersRepository } from "./adminUsers.repository";

async function listUsers() {
  return adminUsersRepository.findAll();
}

async function createUser(input: {
  email: string;
  password: string;
  name: string;
  role: AdminRole;
}) {
  const existing = await adminUsersRepository.findByEmail(input.email);
  if (existing) {
    throw new AppError(409, "An admin with that email already exists");
  }
  const passwordHash = await bcrypt.hash(input.password, 10);
  return adminUsersRepository.create({
    email: input.email,
    passwordHash,
    name: input.name,
    role: input.role,
  });
}

async function updateUser(
  id: string,
  input: { name?: string; role?: AdminRole; isActive?: boolean }
) {
  const existing = await adminUsersRepository.findById(id);
  if (!existing) {
    throw new AppError(404, "Admin user not found");
  }
  return adminUsersRepository.update(id, input);
}

async function deleteUser(id: string, requesterId: string) {
  if (id === requesterId) {
    throw new AppError(400, "Cannot delete your own account");
  }
  const existing = await adminUsersRepository.findById(id);
  if (!existing) {
    throw new AppError(404, "Admin user not found");
  }
  await adminUsersRepository.remove(id);
}

export const adminUsersService = {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
};
