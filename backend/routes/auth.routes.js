import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const router = express.Router();

// Sign Up
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, profileImageUrl, age, gender, experience, specialization, resumeUrl } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    let userData = { name, email, password, role, profileImageUrl };

    if (role === "patient") {
      userData.age = age;
      userData.gender = gender;
    }

    if (role === "doctor") {
      userData.experience = experience;
      userData.specialization = specialization;
      userData.resumeUrl = resumeUrl;
      userData.status = "pending";
    }

    const newUser = new User(userData);
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({
      message: "User registered successfully",
      token,
      name: newUser.name,
      role: newUser.role,
      profileImageUrl: newUser.profileImageUrl,
      age: newUser.age,
      gender: newUser.gender,
      experience: newUser.experience,
      specialization: newUser.specialization,
      resumeUrl: newUser.resumeUrl,
      status: newUser.status,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // Doctor approval check
    if (user.role === "doctor" && user.status === "pending") {
      return res.status(403).json({ message: "Your account is pending admin approval." });
    }

    // Allow login if status is "approved"
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      message: "Login successful",
      token,
      name: user.name,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      status: user.status
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;

