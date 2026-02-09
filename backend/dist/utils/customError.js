"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
exports.createCustomError = createCustomError;
class CustomError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
exports.CustomError = CustomError;
function createCustomError(statusCode, message) {
    return new CustomError(statusCode, message);
}
