import mongoose from "mongoose";

const doctorProfileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: String,
  email: String,
  profileImageUrl: String,
  specialty: String,
  qualifications: String,
  experience_years: Number,
  hospital_address: String,
  consultation_fee: Number,
  bio: String,
  availability: Object,
  is_approved: Boolean,
  rating: Number,
});

const DoctorProfile = mongoose.model("DoctorProfile", doctorProfileSchema);

export default DoctorProfile;