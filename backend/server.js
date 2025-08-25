import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import doctorRoutes from "./routes/doctors.routes.js";
import scheduleRoutes from "./routes/schedule.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import doctorProfileRoutes from "./routes/doctorProfile.routes.js";
import messageRoutes from "./routes/messages.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import stripeWebhookRoutes from "./routes/stripeWebhook.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import reportRoutes from "./routes/reports.routes.js";
import feedbackRouter from "./routes/feedback.routes.js"; // or correct path
import prescriptionRoutes from "./routes/prescription.routes.js";

connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use("/api/stripe", stripeWebhookRoutes); 

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctor-profiles", doctorProfileRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/feedback", feedbackRouter);
app.use("/api/prescriptions", prescriptionRoutes);

app.get("/", (req, res) => {
  res.send("Backend API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
