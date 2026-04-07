import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../db/prisma";
import { env } from "../../config/env";
import { AppError } from "../../shared/errors/app-error";

async function login(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { email } });

  if (!admin || !admin.isActive) {
    throw new AppError(401, "Invalid credentials");
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    throw new AppError(401, "Invalid credentials");
  }

  const token = jwt.sign(
    { sub: admin.id, role: admin.role },
    env.jwtSecret,
    { expiresIn: "24h" }
  );

  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  };
}

export const authService = { login };
