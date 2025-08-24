import express from "express";
import User from "../models/user.model.js";
import DoctorProfile from "../models/doctorProfile.model.js";
import path from "path";
import axios from "axios";
import { protect } from "../middlewares/auth.middleware.js";
import Appointment from "../models/appointment.model.js";

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

// Analytics endpoint
router.get("/analytics", protect, async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();
    // Total doctors
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    // Total patients
    const totalPatients = await User.countDocuments({ role: "patient" });

    // Daily active users (logged in today)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const dailyActiveUsers = await User.countDocuments({
      lastLogin: { $gte: todayStart, $lte: todayEnd }
    });

    // Total appointments
    const totalAppointments = await Appointment.countDocuments();

    // Appointments per day (last 14 days)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
    fourteenDaysAgo.setHours(0, 0, 0, 0);

    const appointmentsPerDay = await Appointment.aggregate([
      {
        $match: {
          createdAt: { $gte: fourteenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Doctor approval rate
    const approvedDoctors = await User.countDocuments({ role: "doctor", status: "approved" });
    const pendingDoctors = await User.countDocuments({ role: "doctor", status: "pending" });

    // Patient registrations per day (last 14 days)
    const patientRegistrationsPerDay = await User.aggregate([
      {
        $match: {
          role: "patient",
          createdAt: { $gte: fourteenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalUsers,
      totalDoctors,
      totalPatients,
      dailyActiveUsers,
      totalAppointments,
      appointmentsPerDay,
      approvedDoctors,
      pendingDoctors,
      patientRegistrationsPerDay
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Reject Doctor (Delete doctor and profile)
router.delete("/reject-doctor/:id", async (req, res) => {
  try {
    const doctorId = req.params.id;
    // Delete doctor user
    await User.findByIdAndDelete(doctorId);
    // Delete doctor profile
    await DoctorProfile.deleteOne({ user_id: doctorId });
    res.status(200).json({ message: "Doctor record deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;