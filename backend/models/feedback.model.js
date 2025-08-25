import mongoose from "mongoose";
const feedbackSchema = new mongoose.Schema({
  rating: Number,
  comment: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  profileImageUrl: String,
  name: String,
  role: String,
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("Feedback", feedbackSchema);