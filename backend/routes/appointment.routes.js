import express from "express";
import Appointment from "../models/appointment.model.js";
import Schedule from "../models/schedule.model.js";
import axios from "axios";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js"; // <-- Add this import

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

    // Condition 1: Max 4 appointments per doctor per day
    const dailyCount = await Appointment.countDocuments({ doctor: doctorId, date });
    if (dailyCount >= 7) {
      return res.status(400).json({ message: "Slots filled for this day. Please choose another day." });
    }

    // Condition 2: Only one appointment per time slot
    const exists = await Appointment.findOne({ doctor: doctorId, date, time });
    if (exists) return res.status(400).json({ message: "This time slot is already booked." });
    
    let videoRoomUrl = "";
    if (req.body.type === "video" || req.body.type === "video-call") {
      // Create Daily.co room
      const dailyRes = await axios.post(
        "https://api.daily.co/v1/rooms",
        { name: `consult-${doctorId}-${Date.now()}` },
        { headers: { Authorization: `Bearer ${process.env.DAILY_API_KEY}` } }
      );
      videoRoomUrl = dailyRes.data.url;
    }
    
    const appointment = await Appointment.create({
      doctor: doctorId,
      patient: patientId,
      date,
      time,
      type: req.body.type,
      symptoms: req.body.symptoms,
      notes: req.body.notes,
      videoRoomUrl 
    });

    // Notify doctor
    await Notification.create({
      user: doctorId,
      type: "appointment",
      message: `New appointment booked by patient.`,
      link: `/doctor/appointments`
    });

    // Notify admin
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      // Get patient and doctor names for message
      let patientName = "";
      let doctorName = "";
      try {
        const patientUser = await User.findById(patientId);
        patientName = patientUser ? patientUser.name : patientId;
        const doctorUser = await User.findById(doctorId);
        doctorName = doctorUser ? doctorUser.name : doctorId;
      } catch {
        patientName = patientId;
        doctorName = doctorId;
      }
      await Notification.create({
        user: admin._id,
        type: "appointment",
        message: `Patient ${patientName} booked an appointment with Dr. ${doctorName}`,
        link: "/admin/appointments"
      });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get appointments for doctor
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const now = new Date();
    const today = now.toISOString().slice(0, 10); // "YYYY-MM-DD"
    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

    const appointments = await Appointment.find({
      doctor: req.params.doctorId,
      $or: [
        { date: { $gt: today } },
        { date: today, time: { $gte: currentTime } }
      ]
    }).populate("patient", "name email");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get appointments for patient
router.get("/patient/:patientId", async (req, res) => {
  try {
    const now = new Date();
    const today = now.toISOString().slice(0, 10); // "YYYY-MM-DD"
    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

    const appointments = await Appointment.find({
      patient: req.params.patientId,
      $or: [
        { date: { $gt: today } },
        { date: today, time: { $gte: currentTime } }
      ]
    })
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