import mongoose from "mongoose";
const reportSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fileUrl: String,
  reviewed: { type: Boolean, default: false }
});
export default mongoose.model("Report", reportSchema);