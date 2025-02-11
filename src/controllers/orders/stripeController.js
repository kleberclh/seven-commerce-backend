import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
const prisma = new PrismaClient();

config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { produtos } = req.body;
    const userId = req.user.id;
    console.log("Usuário ID:", userId);
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
        unit_amount: produto.price, // Já convertido para centavos na consulta
      },
      quantity: produto.quantity,
    }));

    console.log("Line Items:", lineItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems, // Alterado para garantir que está pegando os valores corretos
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        usuarioId: userId,
        produtos: JSON.stringify(produtos),
      },
    });

    console.log("Sessão criada:", session);

    return res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Erro ao criar sessão de checkout:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Webhook do Stripe para capturar eventos de pagamento
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Erro ao validar o webhook:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("🔹 Evento recebido:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("📝 Dados da sessão:", session);

    const usuarioId = session.metadata?.usuarioId;
    const produtos = session.metadata?.produtos
      ? JSON.parse(session.metadata.produtos)
      : [];

    console.log("🔹 ID do usuário:", usuarioId);
    console.log("🔹 Produtos recebidos:", produtos);

    if (!usuarioId || produtos.length === 0) {
      console.error("⚠️ Usuário ou produtos inválidos.");
      return res
        .status(400)
        .json({ success: false, message: "Dados inválidos." });
    }

    try {
      // Verificação do valor total
      const valorTotal = session.amount_total / 100;
      if (valorTotal <= 0) {
        console.error("⚠️ Valor total inválido:", valorTotal);
        return res
          .status(400)
          .json({ success: false, message: "Valor total inválido." });
      }

      // Criando o pedido
      const pedido = await prisma.pedido.create({
        data: {
          usuario: { connect: { id: Number(usuarioId) } },
          total: valorTotal,
          status: "pago",
          produtos: {
            create: produtos.map((p) => ({
              produtoId: p.produtoId,
              titulo: p.titulo || "Produto desconhecido", // Garantir que o título existe
              quantidade: p.quantidade,
              precoUnitario: p.precoUnitario || p.price || 0, // Garantir que o preço existe
            })),
          },
        },
      });

      console.log("✅ Pedido criado com sucesso:", pedido);
    } catch (dbError) {
      console.error("❌ Erro ao criar pedido:", dbError.message);
      return res
        .status(500)
        .json({ success: false, message: "Erro no banco de dados." });
    }
  }

  res.json({ received: true });
};

// export const stripeWebhook = (req, res) => {
//   const sig = req.headers["stripe-signature"];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     console.error("Erro ao validar o webhook:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   console.log("🔹 Evento recebido:", event.type);

//   res.json({ received: true });
// };
