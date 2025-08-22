import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import User from "../models/user.model.js";

const router = express.Router();

router.get("/profile/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "patient") {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      age: user.age,
      gender: user.gender,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update patient profile
router.put("/profile/:id", protect, async (req, res) => {
  try {
    const { age, gender, profileImageUrl } = req.body;
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "patient") {
      return res.status(404).json({ message: "Patient not found" });
    }
    user.age = age;
    user.gender = gender;
    if (profileImageUrl) user.profileImageUrl = profileImageUrl;
    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      age: user.age,
      gender: user.gender,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;