import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  days: [{ type: String, required: true }], // e.g. ["Monday", "Wednesday"]
  startTime: { type: String, required: true }, // e.g. "09:00"
  endTime: { type: String, required: true },   // e.g. "17:00"
});

export default mongoose.model("Schedule", scheduleSchema);