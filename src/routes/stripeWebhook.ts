import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { createOrder } from "../services/order.service.js";
import mongoose from "mongoose";
import { IOrderDoc } from "../types";
dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Stripe yêu cầu raw body, KHÔNG parse JSON ở đây
router.post(
  "/webhook",
  express.raw({ type: "application/json" }), // 👈 Bắt buộc
  async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;

    try {
      // ⚠️ Stripe cần raw body (Buffer), không phải JSON object
      const event = stripe.webhooks.constructEvent(
        req.body, // raw buffer
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );

      console.log("✅ Event received:", event.type);

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        console.log("✅ Payment success 123:", session.metadata);
        try {
          const userId = session.metadata?.userId;
          const items = JSON.parse(session.metadata?.cartItems || "[]");
          const shippingAddress = JSON.parse(session.metadata?.shippingAddress || "{}");

          const newOrder = {
            user: userId ? new mongoose.Types.ObjectId(userId) : undefined,
            reference: session.id,
            items,
            shippingAddress,
            paymentMethod: "stripe",
            paymentResult: {
              id:
                typeof session.payment_intent === "string"
                  ? session.payment_intent
                  : session.payment_intent?.id || "",
              status: session.payment_status ?? "",
              update_time: new Date().toISOString(),
              email_address: session.customer_email ?? "",
            },
            itemsPrice: Number(session.amount_subtotal) / 100,
            shippingPrice: 0,
            taxPrice: 0,
            totalPrice: Number(session.amount_total) / 100,
            isPaid: true,
            paidAt: new Date(),
            isDelivered: false,
            status: "processing" as IOrderDoc["status"],
          };

          const order = await createOrder(newOrder);
          console.log("✅ Order saved aaaa:", order._id);
        } catch (error) {
          console.error("❌ Failed to save order:", error);
        }
      }

      res.json({ received: true });
    } catch (err: any) {
      console.error("❌ Webhook error:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  },
);

export default router;
