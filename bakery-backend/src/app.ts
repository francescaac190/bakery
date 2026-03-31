import cors from "cors";
import express from "express";
import path from "path";
import { apiRouter } from "./routes";
import { errorHandler } from "./shared/http/error-handler";
import { notFoundHandler } from "./shared/http/not-found";
import { sendSuccess } from "./shared/http/response";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Serve uploaded design images
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

  app.get("/", (_req, res) => {
    return sendSuccess(res, { message: "Bakery API is running" });
  });

  app.get("/health", (_req, res) => {
    return sendSuccess(res, { ok: true });
  });

  app.use(apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
