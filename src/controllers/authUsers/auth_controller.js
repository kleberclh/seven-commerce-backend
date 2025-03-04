import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { hasPassword } from "../../utils/passwordUtils.js";

const prisma = new PrismaClient();

// REGISTRA O USUARIO //
async function registrar(req, res) {
  const { name, email, password } = req.body;
  const hashedPassword = await hasPassword(password);

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({
      success: true,
      status: 201,
      message: "Usuário criado com sucesso",
      data: newUser,
    });
  } catch (error) {
    if (error.code === "P2002") {
      res.status(400).json({
        success: false,
        status: 400,
        message: "Já existe um usuário com esse e-mail",
      });
    } else {
      console.error(error);
      res.status(500).json({
        success: false,
        status: 500,
        message: "Ocorreu um erro inesperado",
      });
    }
  }
}

// REALIZA O LOGIN //
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "E-mail ou senha incorretos!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "E-mail ou senha incorretos!" });
    }

    const token = jwt.sign(
      {
        uuid: user.uuid,
        name: user.name,
        isAdmin: user.isAdmin,
        userId: user.id,
      },
      process.env.SECRET,
      {
        expiresIn: "50000h",
      }
    );

    res.json({
      token,
      user_uuid: user.uuid,
      name: user.name,
      isAdmin: user.isAdmin,
      userId: user.id,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function me(req, res) {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Usuário não encontrado." });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        pedidos: {
          include: {
            produtos: true,
            usuario: {
              select: {
                name: true, // Inclui apenas o nome do usuário no pedido
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuário não encontrado." });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export default {
  registrar,
  login,
  me,
};
