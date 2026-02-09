"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowAll = exports.allowAdminAndSuper = exports.allowSuperAdmin = exports.allowStoreAdmin = exports.allowUser = void 0;
exports.roleGuard = roleGuard;
const prisma_1 = require("../lib/prisma");
const customError_1 = require("../utils/customError");
function roleGuard(allowedRoles, requireStoreAdmin = false) {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                throw (0, customError_1.createCustomError)(401, "Unauthorized! Please login first.");
            }
            if (!allowedRoles.includes(req.user.role)) {
                throw (0, customError_1.createCustomError)(403, `Forbidden! Only ${allowedRoles.join(", ")} can access this resource.`);
            }
            if (requireStoreAdmin) {
                if (req.user.role === "admin") {
                    const storeAdmin = await prisma_1.prisma.storeAdmin.findUnique({
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
                        throw (0, customError_1.createCustomError)(403, "Forbidden! You are not assigned to any store.");
                    }
                    if (!storeAdmin.store.isActive) {
                        throw (0, customError_1.createCustomError)(403, "Your store is currently inactive.");
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
        }
        catch (error) {
            next(error);
        }
    };
}
const allowUser = () => roleGuard(["user"]);
exports.allowUser = allowUser;
const allowStoreAdmin = () => roleGuard(["admin"], true);
exports.allowStoreAdmin = allowStoreAdmin;
const allowSuperAdmin = () => roleGuard(["super"]);
exports.allowSuperAdmin = allowSuperAdmin;
const allowAdminAndSuper = () => roleGuard(["admin", "super"]);
exports.allowAdminAndSuper = allowAdminAndSuper;
const allowAll = () => roleGuard(["user", "admin", "super"]);
exports.allowAll = allowAll;
