import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

// Criar um pedido
async function create(req, res) {
    try {
      // O usuarioId é obtido diretamente do req.user configurado pelo middleware authenticateToken
      const usuarioId = req.user.id;
  
      if (!usuarioId) {
        return res.status(401).json({ success: false, message: "Usuário não encontrado." });
      }
  
      const { total, produtos } = req.body;
  
      // Validar os produtos
      const produtosValidos = await prisma.produto.findMany({
        where: { id: { in: produtos.map((p) => p.produtoId) } },
      });
  
      if (produtosValidos.length !== produtos.length) {
        return res.status(400).json({
          success: false,
          message: "Um ou mais produtos não existem.",
        });
      }
  
      // Criar o pedido e os itens do pedido
      const pedido = await prisma.pedido.create({
        data: {
          usuario: { connect: { id: usuarioId } }, // Associando o pedido ao usuário
          total,
          produtos: {
            create: produtos.map((p) => ({
              produtoId: p.produtoId,
              quantidade: p.quantidade,
            })),
          },
        },
        include: {
          produtos: true,
        },
      });
  
      return res.status(201).json({
        success: true,
        message: "Pedido criado com sucesso.",
        data: pedido,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Ocorreu um erro inesperado.",
      });
    }
  }

// Listar pedidos
async function list(req, res) {
  try {
    const orders = await prisma.pedido.findMany({
      include: {
        usuario: true,
        produtos: {
          include: {
            produto: true,
          },
        },
      },
    });
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Ocorreu um erro ao listar os pedidos.",
    });
  }
}

// Atualizar um pedido
async function update(req, res) {
  try {
    const { id } = req.params;
    const { total, produtos } = req.body;

    // Atualizar os dados do pedido
    const updatedOrder = await prisma.pedido.update({
      where: { id },
      data: {
        total,
        produtos: {
          deleteMany: {}, // Remove os produtos existentes
          create: produtos.map((produto) => ({
            produtoId: produto.produtoId,
            quantidade: produto.quantidade,
          })),
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
    res.status(500).json({
      success: false,
      message: "Ocorreu um erro ao atualizar o pedido.",
    });
  }
}

// Remover um pedido
async function remove(req, res) {
  try {
    const { id } = req.params;

    await prisma.pedido.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Pedido excluído com sucesso.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Ocorreu um erro ao excluir o pedido.",
    });
  }
}

export default {
  create,
  list,
  update,
  remove,
};
