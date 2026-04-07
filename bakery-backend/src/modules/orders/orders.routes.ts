import { Router } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { ordersController } from "./orders.controller";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(process.cwd(), "uploads");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `cake-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export const ordersRouter = Router();

ordersRouter.post("/", upload.single("inspirationImage"), ordersController.createOrder);
ordersRouter.get("/:id", ordersController.getOrderById);
