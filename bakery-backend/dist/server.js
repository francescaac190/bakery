"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const env_1 = require("./config/env");
const app = (0, app_1.createApp)();
app.listen(env_1.env.port, () => {
    console.log(`Server running on http://localhost:${env_1.env.port}`);
});
//# sourceMappingURL=server.js.map