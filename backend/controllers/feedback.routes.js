import express from "express";
import { submitFeedback, getAllFeedbacks } from "../controllers/feedback.controller.js";

const router = express.Router();

router.post("/", submitFeedback); // POST /api/feedback/
router.get("/feedbacks", getAllFeedbacks); // GET /api/feedback/feedbacks

export default router;