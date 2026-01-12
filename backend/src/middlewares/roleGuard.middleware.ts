import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { createCustomError } from "../utils/customError";

declare module "express-serve-static-core" {
    interface Request {
        storeAdmin?: {
            id: string;
            storeId: string;
            storeName: string;
            userId: string;
        };
    }
}

type Role = "user" | "admin" | "super";

export function roleGuard(
    allowedRoles: Role[],
    requireStoreAdmin: boolean = false
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw createCustomError(401, "Unauthorized! Please login first.");
            }
            if (!allowedRoles.includes(req.user.role as Role)) {
                throw createCustomError(
                    403,
                    `Forbidden! Only ${allowedRoles.join(", ")} can access this resource.`
                );
            }
            if (requireStoreAdmin) {
                if (req.user.role === "admin") {
                    const storeAdmin = await prisma.storeAdmin.findUnique({
                        where: { userId: req.user.id },
                        include: {
                            store: {
                                select: {
                                    id: true,
                                    name: true,
                                    isActive: true
                                }
                            }
                        }
                    });

                    if (!storeAdmin) {
                        throw createCustomError(
                            403,
                            "Forbidden! You are not assigned to any store."
                        );
                    }
                    if (!storeAdmin.store.isActive) {
                        throw createCustomError(
                            403,
                            "Your store is currently inactive."
                        );
                    }
                    req.storeAdmin = {
                        id: storeAdmin.id,
                        storeId: storeAdmin.storeId,
                        storeName: storeAdmin.store.name,
                        userId: req.user.id
                    };
                }
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}
export const allowUser = () => roleGuard(["user"]);
export const allowStoreAdmin = () => roleGuard(["admin"], true);
export const allowSuperAdmin = () => roleGuard(["super"]);
export const allowAdminAndSuper = () => roleGuard(["admin", "super"]);
export const allowAll = () => roleGuard(["user", "admin", "super"]);