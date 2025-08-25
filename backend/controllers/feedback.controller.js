import Feedback from "../models/feedback.model.js";

export const submitFeedback = async (req, res) => {
  try {
    const { rating, comment, userId, profileImageUrl, name, role } = req.body;
    const feedback = await Feedback.create({
      rating,
      comment,
      userId,
      profileImageUrl,
      name,
      role,
    });
    res.json(feedback);
  } catch (error) {
    console.error("Feedback save error:", error);
    res.status(500).json({ error: "Failed to save feedback", details: error.message });
  }
};

export const getAllFeedbacks = async (req, res) => {
  const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(20);
  res.json(feedbacks);
};