import express from "express";
import {
  createCheckoutSession,
  stripeWebhook,
} from "../../controllers/orders/stripeController.js";
import authenticateToken from "../../middlewares/authUser/authenticateToken.js";

const router = express.Router();

// Rota de checkout com autenticação
router.post("/checkout", authenticateToken, createCheckoutSession);

// O Webhook precisa receber o corpo raw antes do JSON middleware, e não precisa do middleware de autenticação
router.post(
  "/webhook",
  express.raw({ type: "application/json" }), // Necessário para garantir que o corpo da requisição esteja no formato correto
  stripeWebhook
);

export default router;
