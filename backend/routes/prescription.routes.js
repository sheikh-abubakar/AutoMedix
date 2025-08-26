import express from "express";
import Prescription from "../models/prescription.model.js";
import Appointment from "../models/appointment.model.js";
import User from "../models/user.model.js"; 

const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const prescription = new Prescription(req.body); 
    await prescription.save(); 
    res.json(prescription);
  } catch (err) {
    res.status(400).json({ message: "Error creating prescription", error: err.message });
  }  
});

// Get prescriptions for patient
router.get("/patient/:patientId", async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.params.patientId })
      .populate("doctor", "name email");
    res.json(prescriptions);
  } catch (err) {
    res.status(400).json({ message: "Error fetching prescriptions" });
  }
});
 
router.get("/doctor/:doctorId/patients", async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select("_id name");
    res.json(patients);
  } catch (err) {
    res.status(400).json({ message: "Error fetching patients" });
  }
});

export default router;