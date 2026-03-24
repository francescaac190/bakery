"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
function sendSuccess(res, data, statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        data,
        error: null,
    });
}
function sendError(res, message, statusCode = 500, details) {
    return res.status(statusCode).json({
        success: false,
        data: null,
        error: {
            message,
            details: details ?? null,
        },
    });
}
//# sourceMappingURL=response.js.map