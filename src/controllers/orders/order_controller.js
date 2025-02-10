import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Criar um pedido
async function create(req, res) {
  try {
    const usuarioId = req.user.id;
    if (!usuarioId) {
      return res
        .status(401)
        .json({ success: false, message: "Usuário não encontrado." });
    }

    const { produtos } = req.body;

    // Buscar os produtos no banco de dados com os preços atuais
    const produtosNoBanco = await prisma.produto.findMany({
      where: { id: { in: produtos.map((p) => p.produtoId) } },
      select: { id: true, preco: true, titulo: true },
    });

    if (produtosNoBanco.length !== produtos.length) {
      return res
        .status(400)
        .json({ success: false, message: "Um ou mais produtos não existem." });
    }

    // Calcular o total com os preços originais
    const total = produtos.reduce((acc, item) => {
      const produto = produtosNoBanco.find((p) => p.id === item.produtoId);
      return produto ? acc + produto.preco * item.quantidade : acc;
    }, 0);

    // Criar o pedido e salvar os produtos com o preço fixo no momento da compra
    const pedido = await prisma.pedido.create({
      data: {
        usuario: { connect: { id: usuarioId } },
        total,
        produtos: {
          create: produtos.map((p) => {
            const produtoNoBanco = produtosNoBanco.find(
              (prod) => prod.id === p.produtoId
            );
            return {
              produtoId: p.produtoId,
              titulo: produtoNoBanco?.titulo || "Produto desconhecido",
              quantidade: p.quantidade,
              precoUnitario: produtoNoBanco?.preco || 0, // Mantém o preço do momento da compra
            };
          }),
        },
      },
      include: { produtos: true },
    });

    return res.status(201).json({
      success: true,
      message: "Pedido criado com sucesso.",
      data: pedido,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro inesperado." });
  }
}

// Listar pedidos
async function list(req, res) {
  try {
    const orders = await prisma.pedido.findMany({
      include: {
        usuario: { select: { id: true, uuid: true, name: true, email: true } },
        produtos: { include: { produto: true, } },
      },
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Ocorreu um erro ao listar os pedidos.",
      });
  }
}

// Atualizar um pedido
async function update(req, res) {
  try {
    const { id } = req.params;
    const { produtos } = req.body;

    // Buscar os preços atualizados dos produtos
    const produtosNoBanco = await prisma.produto.findMany({
      where: { id: { in: produtos.map((p) => p.produtoId) } },
      select: { id: true, preco: true, titulo: true },
    });

    // Calcular o novo total
    const total = produtos.reduce((acc, item) => {
      const produto = produtosNoBanco.find((p) => p.id === item.produtoId);
      return produto ? acc + produto.preco * item.quantidade : acc;
    }, 0);

    // Atualizar o pedido e substituir os produtos
    const updatedOrder = await prisma.pedido.update({
      where: { id },
      data: {
        total,
        produtos: {
          deleteMany: {}, // Remove os produtos antigos
          create: produtos.map((produto) => {
            const produtoNoBanco = produtosNoBanco.find(
              (p) => p.id === produto.produtoId
            );
            return {
              produtoId: produto.produtoId,
              titulo: produtoNoBanco?.titulo || "Produto desconhecido",
              quantidade: produto.quantidade,
              precoUnitario: produtoNoBanco?.preco || 0,
            };
          }),
        },
      },
      include: { produtos: true },
    });

    res.json({
      success: true,
      message: "Pedido atualizado com sucesso.",
      data: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Ocorreu um erro ao atualizar o pedido.",
      });
  }
}

// Remover um pedido
async function remove(req, res) {
  try {
    const { id } = req.params;

    await prisma.pedido.delete({ where: { id } });

    res.json({ success: true, message: "Pedido excluído com sucesso." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Ocorreu um erro ao excluir o pedido.",
      });
  }
}

// Buscar um pedido pelo UUID
async function getByUuid(req, res) {
  try {
    const { uuid } = req.params;

    const order = await prisma.pedido.findUnique({
      where: { uuid },
      include: {
        usuario: { select: { id: true, uuid: true, name: true, email: true } },
        produtos: {
          include: {
            produto: {
              select: {
                id: true,
                uuid: true,
                titulo: true,
                descricao: true,
                preco: true,
                quantidade: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Pedido não encontrado." });
    }

    // Formatando a resposta
    const formattedOrder = {
      id: order.id,
      uuid: order.uuid,
      usuarioId: order.usuario.id,
      total: order.total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      usuario: order.usuario,
      produtos: order.produtos.map((produtoPedido) => ({
        id: produtoPedido.id,
        pedidoId: order.id,
        produtoId: produtoPedido.produtoId,
        titulo: produtoPedido.titulo,
        quantidade: produtoPedido.quantidade,
        precoUnitario: produtoPedido.precoUnitario,
        produto: produtoPedido.produto,
      })),
    };

    res.json({ success: true, data: formattedOrder });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro ao buscar o pedido." });
  }
}

export default {
  create,
  list,
  update,
  remove,
  getByUuid,
};
