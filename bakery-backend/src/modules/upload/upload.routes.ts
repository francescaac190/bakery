import { Router } from "express";
import type { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireRole } from "../../shared/middleware/requireRole";
import { sendSuccess, sendError } from "../../shared/http/response";
import { env } from "../../config/env";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Solo se permiten archivos de imagen"));
  },
});

export const uploadRouter = Router();

uploadRouter.post(
  "/",
  requireRole("SUPER_ADMIN"),
  upload.single("file"),
  (req: Request, res: Response) => {
    if (!req.file) {
      sendError(res, "No se recibió ningún archivo", 400);
      return;
    }
    const baseUrl =
      process.env.BASE_URL ?? `http://localhost:${env.port}`;
    const url = `${baseUrl}/uploads/${req.file.filename}`;
    sendSuccess(res, { url });
  }
);
