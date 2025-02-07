import { PrismaClient } from "@prisma/client";

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

  export default{
    usuarios,
  }