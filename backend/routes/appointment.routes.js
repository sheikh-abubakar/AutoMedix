import express from "express";
import Appointment from "../models/appointment.model.js";
import Schedule from "../models/schedule.model.js";

const router = express.Router();

// Book appointment
router.post("/book", async (req, res) => {
  try {
    const { doctorId, patientId, date, time } = req.body;
    const schedule = await Schedule.findOne({ doctor: doctorId });
    if (!schedule) return res.status(400).json({ message: "Doctor schedule not found" });
    const dayOfWeek = new Date(date).toLocaleString("en-US", { weekday: "long" });
    if (!schedule.days.includes(dayOfWeek)) {
      return res.status(400).json({ message: "Doctor not available on this day" });
    }
    if (time < schedule.startTime || time > schedule.endTime) {
      return res.status(400).json({ message: "Doctor not available at this time" });
    }
    const exists = await Appointment.findOne({ doctor: doctorId, date, time });
    if (exists) return res.status(400).json({ message: "Slot already booked" });

    const appointment = await Appointment.create({ doctor: doctorId, patient: patientId, date, time });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get appointments for doctor
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.params.doctorId }).populate("patient", "name email");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get appointments for patient
router.get("/patient/:patientId", async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.params.patientId })
      .populate("doctor", "name email profileImageUrl specialization");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Cancel appointment
router.delete("/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const deleted = await Appointment.findByIdAndDelete(appointmentId);
    if (!deleted) return res.status(404).json({ message: "Appointment not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;