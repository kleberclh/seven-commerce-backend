import express from "express";
import {
  createCheckoutSession,
  stripeWebhook,
} from "../../controllers/orders/stripeController.js";

const router = express.Router();

router.post("/checkout", createCheckoutSession);

// O Webhook precisa receber o raw body antes do JSON middleware
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;
