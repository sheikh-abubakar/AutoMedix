import mongoose from "mongoose";

const PrescriptionSchema = new mongoose.Schema({
  prescriptionId: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  diagnosis: { type: String, required: true },
  medicine: { type: String, required: true },
  dosage: { type: String, required: true },
  duration: { type: String, required: true },
  instructions: { type: String }
}, { timestamps: true });

// Auto-generate prescriptionId before saving
PrescriptionSchema.pre("save", function (next) {
  if (!this.prescriptionId) {
    this.prescriptionId = "RX-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  }
  next();
});

export default mongoose.model("Prescription", PrescriptionSchema);