import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Feedback() {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    await axios.post("http://localhost:5000/api/feedback", {
      rating,
      comment,
      userId: user?._id,
      profileImageUrl: user?.profileImageUrl,
      name: user?.name,
      role: user?.role,
    });
    setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-gradient-to-br from-primary-50 to-white rounded-2xl shadow-2xl border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary flex items-center justify-center gap-2">
        <span>Give Your Feedback</span>
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#facc15"/></svg>
      </h2>
      <div className="mb-6">
        <label className="block font-medium mb-2 text-gray-700">Rate Us</label>
        <div className="flex gap-2 justify-center">
          {[1,2,3,4,5].map(star => (
            <button
              key={star}
              type="button"
              className={`focus:outline-none text-3xl transition-transform ${star <= rating ? "text-yellow-400 scale-110" : "text-gray-300"}`}
              onClick={() => setRating(star)}
              aria-label={`Rate ${star}`}
            >★</button>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <label className="block font-medium mb-2 text-gray-700">Your Comments</label>
        <textarea
          className="border border-gray-200 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-primary focus:outline-none resize-none text-gray-800 shadow-sm"
          rows={4}
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Share your experience..."
        />
      </div>
      <Button className="w-full py-3 text-lg font-semibold bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition" onClick={handleSubmit}>
        Submit Feedback
      </Button>
      {submitted && <p className="text-green-600 text-center mt-6 text-base font-medium">Thank you for your feedback!</p>}
    </div>
  );
}