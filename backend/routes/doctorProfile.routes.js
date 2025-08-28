import express from "express";
import mongoose from "mongoose";
import DoctorProfile from "../models/doctorProfile.model.js";
import User from "../models/user.model.js";

const router = express.Router();

// Get doctor profile by user ID (create if not exists)
router.get("/:userId", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId); 
    let profile = await DoctorProfile.findOne({ user_id: userId });
    if (!profile) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      profile = new DoctorProfile({
        user_id: user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl || "",
        specialty: user.specialization || "",
        qualifications: "",
        experience_years: user.experience || 0,
        hospital_address: "",
        consultation_fee: 0,
        bio: "",
        availability: {},
        is_approved: false,
        rating: 0,
      });
      await profile.save();
    }
    res.json(profile);
  } catch (err) {
    console.error("Error in doctor profile GET:", err);
    res.status(500).json({ message: err.message });
  }
});

// Update doctor profile by user ID
router.put("/:userId", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const profile = await DoctorProfile.findOneAndUpdate(
      { user_id: userId },
      req.body,
      { new: true }
    );
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;