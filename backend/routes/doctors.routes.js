import express from "express";
const router = express.Router();

// GET /api/doctors?name=...&specialization=...
router.get("/", async (req, res) => {
  const { name, specialization } = req.query;
  let query = { role: "doctor", status: "approved" };
  if (name) query.name = { $regex: name, $options: "i" };
  if (specialization) query.specialization = { $regex: specialization, $options: "i" };
  const doctors = await User.find(query);
  res.json(doctors);
});

export default router;