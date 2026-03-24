"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
exports.env = {
    port: Number(process.env.PORT ?? 1313),
    nodeEnv: process.env.NODE_ENV ?? "development",
    apiPrefix: process.env.API_PREFIX ?? "/api/v1",
};
//# sourceMappingURL=env.js.map