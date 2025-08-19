import express from "express";
import User from "../models/user.model.js";

const router = express.Router();

// Get all doctors or search by name/specialization
router.get("/", async (req, res) => {
  try {
    const { name, specialization } = req.query;
    let query = { role: "doctor", status: "approved" };

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }
    if (specialization) {
      query.specialization = { $regex: specialization, $options: "i" };
    }

    const doctors = await User.find(query).select("-password");
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get doctor by ID
router.get("/:id", async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: "doctor", status: "approved" }).select("-password");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }); // adjust filter as needed
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;