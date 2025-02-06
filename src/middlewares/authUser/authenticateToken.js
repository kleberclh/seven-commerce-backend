import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Nenhum token foi fornecido!" });
  }

  jwt.verify(token, process.env.SECRET, (error, user) => {
    if (error) {
      return res.status(403).json({ message: "Token inválido!" });
    }
    req.user = {
      id: user.userId,
      isAdmin: user.isAdmin, //informado o isAdmin: user.isAdmin para o retorno dar certo pelo token
      email: user.email,
      name: user.name,
      uuid: user.uuid,
    };
    next();
  });
};

export default authenticateToken;
