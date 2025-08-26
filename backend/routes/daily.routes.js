import express from "express";
import axios from "axios";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create a Daily.co room
router.post("/create-room", protect, async (req, res) => {
  try {
    const { name } = req.body;
    const response = await axios.post(
      "https://api.daily.co/v1/rooms",
      {
        name,
        properties: {
          enable_chat: true,
          enable_screenshare: true,
          start_video_off: false,
          start_audio_off: false,
          exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiry
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Failed to create Daily.co room", error: err.message });
  }
});

export default router;