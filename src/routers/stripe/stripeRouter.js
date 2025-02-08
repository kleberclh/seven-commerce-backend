import express from "express";
import {
  createCheckoutSession,
  stripeWebhook,
} from "../../controllers/orders/stripeController.js";

const router = express.Router();

router.post("/checkout", createCheckoutSession);

// O Webhook precisa receber o raw body do request
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;
