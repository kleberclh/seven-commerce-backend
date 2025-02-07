import { PrismaClient } from "@prisma/client";
import { formatarCpf } from "../../utils/formatarCpf.js";
import { formatarTelefone } from "../../utils/formatarTelefone.js";

// LISTA TODOS OS USUÁRIOS //
const prisma = new PrismaClient();
async function usuarios(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        uuid: true,
        name: true,
        email: true,
        isAdmin: true,
      },
    });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro inesperado" });
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.user.uuid;
    const {
      name,
      email,
      rua,
      cep,
      estado,
      pais,
      telefone,
      cpf,
      numero,
      bairro,
      cidade,
      complemento,
    } = req.body;

    const cpfFormatado = cpf ? formatarCpf(cpf) : null;
    const telefoneFormatado = telefone ? formatarTelefone(telefone) : null;

    const updateUser = await prisma.user.update({
      where: { uuid: userId },
      data: {
        name,
        email,
        rua,
        cep,
        estado,
        pais,
        telefone: telefoneFormatado,
        cpf: cpfFormatado,
        numero,
        bairro,
        cidade,
        complemento,
      },
    });

    res.json({
      menssage: "Dados atualizados com sucesso!",
      user: updateUser,
    });
  } catch (error) {
    console.error("Erro ao atualizar o usuario: ", error);
    res.status(500).json({ message: "Ocorreu um erro inesperado" });
  }
}

export default {
  usuarios,
  updateUser,
};
