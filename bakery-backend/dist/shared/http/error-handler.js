import { ZodError } from "zod";
import { AppError } from "../errors/app-error";
import { sendError } from "./response";
export function errorHandler(err, _req, res, _next) {
    if (err instanceof ZodError) {
        return sendError(res, "Validation error", 400, err.flatten());
    }
    if (err instanceof AppError) {
        return sendError(res, err.message, err.statusCode, err.details);
    }
    return sendError(res, "Internal server error", 500);
}
//# sourceMappingURL=error-handler.js.map