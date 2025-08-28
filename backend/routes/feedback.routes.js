import express from "express";
import { submitFeedback, getAllFeedbacks } from "../controllers/feedback.controller.js";

const router = express.Router();

router.post("/", submitFeedback);
router.get("/feedbacks", getAllFeedbacks);

export default router;