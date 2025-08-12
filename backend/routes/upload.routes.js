import express from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { uploadFile } from "../controllers/upload.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, upload.single("file"), uploadFile);

export default router;
