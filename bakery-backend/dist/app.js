"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const error_handler_1 = require("./shared/http/error-handler");
const not_found_1 = require("./shared/http/not-found");
const response_1 = require("./shared/http/response");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.get("/", (_req, res) => {
        return (0, response_1.sendSuccess)(res, { message: "Bakery API is running" });
    });
    app.get("/health", (_req, res) => {
        return (0, response_1.sendSuccess)(res, { ok: true });
    });
    app.use(routes_1.apiRouter);
    app.use(not_found_1.notFoundHandler);
    app.use(error_handler_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map