"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = adminMiddleware;
const customError_1 = require("../utils/customError");
function adminMiddleware(req, res, next) {
    try {
        if (!req.user) {
            throw (0, customError_1.createCustomError)(401, "Unauthorized!");
        }
        if (req.user.role !== "admin" && req.user.role !== "super") {
            throw (0, customError_1.createCustomError)(403, "Forbidden");
        }
        next();
    }
    catch (error) {
        next(error);
    }
}
