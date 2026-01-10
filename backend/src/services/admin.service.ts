import { prisma } from "../lib/prisma";
import { createCustomError } from "../utils/customError";

export async function listUsersService() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      role: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
}

export async function updateUserRoleService(userId: string, role: string) {
  if (role !== "user" && role !== "admin") {
    throw createCustomError(400, "Invalid role");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!user) throw createCustomError(404, "User not found");
  if (user.role === "super") {
    throw createCustomError(403, "Cannot update super user");
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      role: role,
      updated_at: new Date(),
    },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      role: true,
    },
  });
}

export async function deleteUserService(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!user) throw createCustomError(404, "User not found");
  if (user.role === "super") {
    throw createCustomError(403, "Cannot delete super user");
  }

  await prisma.user.delete({ where: { id: userId } });
}
