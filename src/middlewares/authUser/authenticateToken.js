import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  // Extrair o token do cabeçalho Authorization
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Nenhum token foi fornecido!" });
  }

  // Verificar o token
  jwt.verify(token, process.env.SECRET, (error, user) => {
    if (error) {
      return res.status(403).json({ message: "Token inválido!" });
    }

    // Adicionar os dados do usuário ao req.user para que fiquem disponíveis em outras partes da aplicação
    req.user = {
      id: user.userId, // ID do usuário extraído do token
      isAdmin: user.isAdmin, // A informação sobre o administrador, caso exista
      email: user.email, // Email do usuário
      name: user.name, // Nome do usuário
      uuid: user.uuid, // UUID do usuário
    };

    // Continuar com a execução do próximo middleware ou rota
    next();
  });
};

export default authenticateToken;
