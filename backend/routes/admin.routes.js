import express from "express";
import User from "../models/user.model.js";
import path from "path";
import axios from "axios";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get admin profile info
router.get("/profile/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "admin") {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({
      email: user.email,
      profileImageUrl: user.profileImageUrl,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all pending doctors
router.get("/pending-doctors", async (req, res) => {
  try {
    const pendingDoctors = await User.find({ role: "doctor", status: "pending" });
    res.json(pendingDoctors);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Approve doctor
router.post("/approve-doctor/:id", async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== "doctor") return res.status(404).json({ message: "Doctor not found" });

    doctor.status = "approved";
    await doctor.save();
    res.json({ message: "Doctor approved" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Reject doctor
router.post("/reject-doctor/:id", async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== "doctor") return res.status(404).json({ message: "Doctor not found" });

    doctor.status = "rejected";
    await doctor.save();
    res.json({ message: "Doctor rejected" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Download resume (proxy to Cloudinary)
router.get("/download-resume/:id", async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== "doctor" || !doctor.resumeUrl) return res.status(404).json({ message: "Resume not found" });

    const fileUrl = doctor.resumeUrl;
    const fileName = path.basename(fileUrl);

    const response = await axios.get(fileUrl, { responseType: "stream" });
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    response.data.pipe(res);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all approved doctors
router.get("/approved-doctors", async (req, res) => {
  const approvedDoctors = await User.find({ role: "doctor", status: "approved" });
  res.json(approvedDoctors);
});

export default router;