"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsersService = listUsersService;
exports.updateUserRoleService = updateUserRoleService;
exports.deleteUserService = deleteUserService;
const prisma_1 = require("../lib/prisma");
const customError_1 = require("../utils/customError");
async function listUsersService() {
    return prisma_1.prisma.user.findMany({
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
async function updateUserRoleService(userId, role) {
    if (role !== "user" && role !== "admin") {
        throw (0, customError_1.createCustomError)(400, "Invalid role");
    }
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
    });
    if (!user)
        throw (0, customError_1.createCustomError)(404, "User not found");
    if (user.role === "super") {
        throw (0, customError_1.createCustomError)(403, "Cannot update super user");
    }
    return prisma_1.prisma.user.update({
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
async function deleteUserService(userId) {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
    });
    if (!user)
        throw (0, customError_1.createCustomError)(404, "User not found");
    if (user.role === "super") {
        throw (0, customError_1.createCustomError)(403, "Cannot delete super user");
    }
    await prisma_1.prisma.user.delete({ where: { id: userId } });
}
