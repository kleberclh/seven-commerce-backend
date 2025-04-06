import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import userRouter from "./routers/auth/userRouter.js";
import productRouter from "./routers/products/router_products.js";
import orderRouter from "./routers/orders/router_order.js";
import stripeRouter from "./routers/stripe/stripeRouter.js";

// Obter o diretório atual de forma compatível com ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Permite apenas seu frontend específico
    methods: ["GET", "POST", "DELETE", "PUT"], // Métodos permitidos
    credentials: true, // Habilita o envio de cookies e credenciais
  })
);

// 🚨 O Webhook do Stripe PRECISA vir antes de express.json()
app.use(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeRouter
);

// Aplicar JSON e URL Encoded para as demais rotas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, "public")));

// Rota para o home que retorna o arquivo HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Rotas normais
app.use(userRouter);
app.use(productRouter);
app.use(orderRouter);

// Rota para outras funções do Stripe
app.use("/stripe", stripeRouter);

export default app;
