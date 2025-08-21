import dotenv from "dotenv";
dotenv.config();
import express from "express";
import Stripe from "stripe";
import Appointment from "../models/appointment.model.js";
import User from "../models/user.model.js";

const router = express.Router();

console.log("Stripe Key:", process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Checkout Session for an appointment
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await Appointment.findById(appointmentId).populate("doctor");
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    // Use doctor's consultation_fee or fallback
    const amount = appointment.doctor.consultation_fee || 1000; // in PKR or USD cents

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd", // or "pkr" if supported
            product_data: {
              name: `Consultation with ${appointment.doctor.name}`,
            },
            unit_amount: amount * 100, // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/payment-cancel",
      metadata: {
        appointmentId: appointment._id.toString(),
        patientId: appointment.patient.toString(),
        doctorId: appointment.doctor._id.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ message: "Stripe error" });
  }
});

export default router;