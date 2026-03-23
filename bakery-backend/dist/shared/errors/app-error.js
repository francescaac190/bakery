export class AppError extends Error {
    statusCode;
    code;
    details;
    constructor(statusCode, message, code = "APP_ERROR", details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}
//# sourceMappingURL=app-error.js.map