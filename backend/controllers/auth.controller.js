import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import DoctorProfile from "../models/doctorProfile.model.js";

dotenv.config();

// ======================= TOKEN GENERATOR =======================
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ======================= REGISTER =======================
export const registerUser = async (req, res) => {
  try {
    let { name, email, password, role, profileImageUrl, experience, specialization } = req.body;
    role = role ? role.toLowerCase() : "patient";
    console.log("Received data:", { name, email, password, role, profileImageUrl });

    if (!profileImageUrl) {
      return res.status(400).json({ message: "Profile image is required" });
    }
    // Check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({ name, email, password, role, profileImageUrl, experience, specialization });


    // Auto-create doctor profile if role is doctor
     if (role === "doctor") {
      await DoctorProfile.create({
        user_id: user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        specialty: user.specialization || "",
        qualifications: "",
        experience_years: user.experience || 0,
        hospital_address: "",
        consultation_fee: 0,
        bio: "",
        availability: {},
        is_approved: false,
        rating: 0,
      });
    }

    // Send response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================= LOGIN =======================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check empty fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter both email and password" });
    }

    // Find user
    const user = await User.findOne({ email });

    // Match password
    if (user && (await user.matchPassword(password))) {
      // Auto-create doctor profile if missing
      if (user.role === "doctor") {
        const profile = await DoctorProfile.findOne({ user_id: user._id });
        if (!profile) {
          await DoctorProfile.create({
            user_id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            specialty: user.specialization || "",
            qualifications: "",
            experience_years: user.experience || 0,
            hospital_address: "",
            consultation_fee: 0,
            bio: "",
            availability: {},
            is_approved: false,
            rating: 0,
          });
        }
      }
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImageUrl: user.profileImageUrl,
        token: generateToken(user._id, user.role),
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};