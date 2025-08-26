import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // doctor
  type: { type: String, required: true }, // e.g. "appointment", "payment", "report", "message"
  message: { type: String, required: true },
  link: { type: String }, 
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Notification", notificationSchema);