import cloudinary from "../utils/cloudinary.js";

export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const uploadResult = await cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "medical_reports" },
      (error, result) => {
        if (error) return res.status(500).json({ message: error.message });
        res.json({ url: result.secure_url });
      }
    );
    file.stream.pipe(uploadResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
