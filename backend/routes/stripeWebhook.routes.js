import express from "express";
import Stripe from "stripe";
import Appointment from "../models/appointment.model.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

// Stripe requires the raw body for webhook signature verification
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET // Set this in your .env from Stripe dashboard
    );
  } catch (err) {
    console.log("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const appointmentId = session.metadata?.appointmentId;
    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, { paymentStatus: "paid" });
      console.log(`Appointment ${appointmentId} marked as paid.`);
    }
  }

  res.json({ received: true });
});

export default router;