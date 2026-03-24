"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const app_error_1 = require("../errors/app-error");
const response_1 = require("./response");
function errorHandler(err, _req, res, _next) {
    if (err instanceof zod_1.ZodError) {
        return (0, response_1.sendError)(res, "Validation error", 400, err.flatten());
    }
    if (err instanceof app_error_1.AppError) {
        return (0, response_1.sendError)(res, err.message, err.statusCode, err.details);
    }
    return (0, response_1.sendError)(res, "Internal server error", 500);
}
//# sourceMappingURL=error-handler.js.map