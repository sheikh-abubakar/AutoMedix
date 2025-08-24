import Report from "../models/report.model.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "reports",
    resource_type: "auto",
  },
});
export const uploadMiddleware = multer({ storage });

export const uploadReport = async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;
    const fileUrl = req.file.path; // Cloudinary URL
    const report = await Report.create({ patientId, doctorId, fileUrl });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: "Error uploading report" });
  }
};

export const getDoctorReports = async (req, res) => {
  try {
    const reports = await Report.find({ doctorId: req.params.doctorId }).populate("patientId");
    res.json(reports.map(r => ({
      ...r._doc,
      patientName: r.patientId?.name || "Unknown"
    })));
  } catch (err) {
    res.status(500).json({ message: "Error fetching reports" });
  }
};

export const markReviewed = async (req, res) => {
  try {
    await Report.findByIdAndUpdate(req.body.reportId, { reviewed: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Error marking as reviewed" });
  }
};