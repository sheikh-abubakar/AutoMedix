import express from "express";
import { uploadReport, getDoctorReports, markReviewed, uploadMiddleware } from "../controllers/reports.controller.js";
import Notification from "../models/notification.model.js";

const router = express.Router();

router.post("/upload", uploadMiddleware.single("report"), uploadReport);
router.get("/doctor/:doctorId", getDoctorReports);
router.post("/reviewed", markReviewed);

export default router;