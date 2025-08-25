import express from "express";
import Prescription from "../models/prescription.model.js";
import Appointment from "../models/appointment.model.js";
const router = express.Router();// Create prescription
router.post("/", async (req, res) => {
  try {
    const prescription = await Prescription.create(req.body);
    res.json(prescription);
  } catch (err) {
    res.status(400).json({ message: "Error creating prescription" });
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

// Get all patients for dropdown (fetch from appointments)
router.get("/doctor/:doctorId/patients", async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.params.doctorId }).populate("patient", "name");
    console.log("Appointments found:", appointments);

    const seen = new Set();
    const uniquePatients = [];
    appointments.forEach(app => {
      if (app.patient && !seen.has(app.patient._id.toString())) {
        uniquePatients.push(app.patient);
        seen.add(app.patient._id.toString());
      }
    });

    console.log("Unique patients:", uniquePatients);
    res.json(uniquePatients);
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(400).json({ message: "Error fetching patients" });
  }
});

export default router;