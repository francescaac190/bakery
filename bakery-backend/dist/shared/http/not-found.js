"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
const response_1 = require("./response");
function notFoundHandler(req, res) {
    return (0, response_1.sendError)(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}
//# sourceMappingURL=not-found.js.map