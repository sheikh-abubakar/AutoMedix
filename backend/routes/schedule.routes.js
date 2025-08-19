import express from "express";
import Schedule from "../models/schedule.model.js";

const router = express.Router();

router.post("/set", async (req, res) => {
  try {
    const { doctorId, days, startTime, endTime } = req.body;
    if (!doctorId || !days || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    let schedule = await Schedule.findOne({ doctor: doctorId });
    if (schedule) {
      schedule.days = days;
      schedule.startTime = startTime;
      schedule.endTime = endTime;
      await schedule.save();
    } else {
      schedule = await Schedule.create({ doctor: doctorId, days, startTime, endTime });
    }
    res.json(schedule);
  } catch (error) {
    console.error("Schedule save error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

router.get("/:doctorId", async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ doctor: req.params.doctorId });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;