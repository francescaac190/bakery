import { sendError } from "./response";
export function notFoundHandler(req, res) {
    return sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}
//# sourceMappingURL=not-found.js.map