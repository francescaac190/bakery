import type { AdminRole } from "@prisma/client";
import { prisma } from "../../db/prisma";

const safeSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

async function findAll() {
  return prisma.adminUser.findMany({
    select: safeSelect,
    orderBy: { createdAt: "desc" },
  });
}

async function findById(id: string) {
  return prisma.adminUser.findUnique({ where: { id } });
}

async function findByEmail(email: string) {
  return prisma.adminUser.findUnique({ where: { email } });
}

async function create(data: {
  email: string;
  passwordHash: string;
  name: string;
  role: AdminRole;
}) {
  return prisma.adminUser.create({ data, select: safeSelect });
}

async function update(
  id: string,
  data: { name?: string; role?: AdminRole; isActive?: boolean }
) {
  return prisma.adminUser.update({ where: { id }, data, select: safeSelect });
}

async function remove(id: string) {
  return prisma.adminUser.delete({ where: { id } });
}

export const adminUsersRepository = {
  findAll,
  findById,
  findByEmail,
  create,
  update,
  remove,
};
