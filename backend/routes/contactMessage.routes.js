import express from "express";
import ContactMessage from "../models/ContactMessage.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  const msg = await ContactMessage.create({ name, email, message });
  res.json(msg);
});

router.get("/", async (req, res) => {
  const msgs = await ContactMessage.find().sort({ createdAt: -1 });
  res.json(msgs);
});

export default router;