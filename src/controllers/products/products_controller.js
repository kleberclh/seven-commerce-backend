import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();



async function getByUuid(req, res) {
  try {
    const { uuid } = req.params;
    const product = await prisma.produto.findUnique({
      where: { uuid },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Ocorreu um erro inesperado",
    });
  }
}

async function create(req, res) {
  try {
    const { titulo, descricao, preco, quantidade } = req.body;
    const newProduct = await prisma.produto.create({
      data: {
        titulo,
        descricao,
        preco,
        quantidade,
      },
    });
    res.status(201).json({
      success: true,
      message: "Novo produto criado com sucesso",
      data: newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Ocorreu um erro inesperado",
    });
    console.log(error);
  }
}

async function list(req, res) {
  try {
    const products = await prisma.produto.findMany();
    res.json({
      success: true,
      produto: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Ocorreu um erro inesperado",
    });
  }
}

async function update(req, res) {
  try {
    const { uuid } = req.params;
    const { titulo, descricao, preco, quantidade } = req.body;
    const updatedProduct = await prisma.produto.update({
      where: { uuid },
      data: {
        titulo,
        descricao,
        preco,
        quantidade,
      },
    });
    res.json({
      success: true,
      message: "Produto atualizado com sucesso",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Ocorreu um erro inesperado",
    });
  }
}

async function remove(req, res) {
  try {
    const { uuid } = req.params;
    await prisma.produto.delete({ where: { uuid } });
    res.json({
      success: true,
      message: "Produto excluído com sucesso",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Ocorreu um erro inesperado",
    });
  }
}
export default {
  getByUuid,
  create,
  list,
  update,
  remove,
};
