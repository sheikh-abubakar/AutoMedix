import express from "express";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

const router = express.Router();

// Get all doctors (for patient chat sidebar)
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor", status: "approved" }).select("_id name profileImageUrl role specialization");
    res.json(doctors.map(doc => ({
      id: doc._id,
      name: doc.name,
      profileImageUrl: doc.profileImageUrl,
      role: doc.role,
      specialization: doc.specialization || "",
    })));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all conversations for a user (doctor or patient)
router.get("/conversations/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ createdAt: 1 });

    const partners = {};
    messages.forEach(msg => {
      const partnerId = msg.senderId.toString() === userId ? msg.receiverId.toString() : msg.senderId.toString();
      if (!partners[partnerId]) partners[partnerId] = [];
      partners[partnerId].push(msg);
    });

    const conversations = await Promise.all(Object.keys(partners).map(async (partnerId) => {
      const user = await User.findById(partnerId).select("name profileImageUrl role specialization");
      const msgs = partners[partnerId];
      if (!user) return null; // <-- skip if user deleted
      return {
        partner: {
          id: user._id,
          name: user.name,
          profileImageUrl: user.profileImageUrl,
          role: user.role,
          specialization: user.specialization || "",
        },
        messages: msgs,
        lastMessage: msgs[msgs.length - 1],
      };
    }));
    res.json(conversations.filter(Boolean)); 
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Send a message
router.post("/", async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;
    const message = await Message.create({ senderId, receiverId, content });
    await Notification.create({
      user: receiverId, // doctor
      type: "message",
      message: `New message from patient.`,
      link: `/doctor/messages`
    });
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;