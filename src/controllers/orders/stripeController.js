import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
const prisma = new PrismaClient();

config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Criar um checkout no Stripe
export const createCheckoutSession = async (req, res) => {
  try {
    const { produtos } = req.body;

    console.log("Produtos recebidos:", produtos);

    if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
      return res.status(400).json({ error: "Lista de produtos inválida" });
    }

    // Buscar os produtos no banco de dados para obter os preços reais
    const produtosNoBanco = await Promise.all(
      produtos.map(async (item) => {
        const produto = await prisma.produto.findUnique({
          where: { id: item.produtoId },
          select: { titulo: true, preco: true },
        });

        if (!produto) {
          throw new Error(`Produto com ID ${item.produtoId} não encontrado.`);
        }

        return {
          name: produto.titulo,
          price: produto.preco * 100, // Convertendo para centavos
          quantity: item.quantidade,
        };
      })
    );

    console.log("Produtos do banco:", produtosNoBanco);

    const lineItems = produtosNoBanco.map((produto) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: produto.name,
        },
        unit_amount: produto.price, // Preço real do produto
      },
      quantity: produto.quantity,
    }));

    console.log("Line Items:", lineItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    console.log("Sessão criada:", session);

    return res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Erro ao criar sessão de checkout:", error);
    return res.status(500).json({ error: error.message });
  }
};
// Webhook do Stripe para capturar eventos de pagamento
export async function stripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const usuarioId = session.metadata.usuarioId;
      const produtos = session.display_items;

      // Criar o pedido no banco de dados
      const pedido = await prisma.pedido.create({
        data: {
          usuario: { connect: { id: Number(usuarioId) } },
          total: session.amount_total / 100,
          status: "pago",
          produtos: {
            create: produtos.map((p) => ({
              produtoId: p.custom.id,
              titulo: p.custom.name,
              quantidade: p.quantity,
              precoUnitario: p.amount / 100,
            })),
          },
        },
      });

      console.log("Pedido criado:", pedido);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
