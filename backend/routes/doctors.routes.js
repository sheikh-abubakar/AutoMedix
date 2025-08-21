import express from "express";
import User from "../models/user.model.js";
import DoctorProfile from "../models/doctorProfile.model.js";

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

    // Get all doctors from User collection
    const doctors = await User.find(query).select("-password");

    // For each doctor, get their profile info and merge
    const doctorList = await Promise.all(
      doctors.map(async (doctor) => {
        const profile = await DoctorProfile.findOne({ user_id: doctor._id });
        return {
          _id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          profileImageUrl: profile?.profileImageUrl || doctor.profileImageUrl || "",
          specialization: profile?.specialty || doctor.specialization || "",
          experience_years: profile?.experience_years ?? doctor.experience ?? "",
          qualifications: profile?.qualifications || "",
          hospital_address: profile?.hospital_address || "",
          bio: profile?.bio || "",
          consultation_fee: profile?.consultation_fee || "",
          // add other fields if needed
        };
      })
    );

    res.json(doctorList);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get doctor by ID
router.get("/:id", async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: "doctor", status: "approved" }).select("-password");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    const profile = await DoctorProfile.findOne({ user_id: doctor._id });
    res.json({
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      profileImageUrl: profile?.profileImageUrl || doctor.profileImageUrl || "",
      specialization: profile?.specialty || doctor.specialization || "",
      experience_years: profile?.experience_years ?? doctor.experience ?? "",
      qualifications: profile?.qualifications || "",
      hospital_address: profile?.hospital_address || "",
      bio: profile?.bio || "",
      consultation_fee: profile?.consultation_fee || "",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;