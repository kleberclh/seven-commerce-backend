import express from "express"

import cors from "cors"
import path from "path";

import { fileURLToPath } from 'url';
import userRouter from "./routers/auth/userRouter.js";
import productRouter from "./routers/products/router_products.js";
import orderRouter from "./routers/orders/router_order.js";

// Obter o diretório atual de forma compatível com ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota para o home que vai retornar o arquivo HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(userRouter)
app.use(productRouter)
app.use(orderRouter)
  

export default app