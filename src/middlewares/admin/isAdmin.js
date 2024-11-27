const isAdmin = (req, res, next) => {
    const user = req.user;
  
    if (user && user.isAdmin) {
      return next();
    }
  
    return res
      .status(403)
      .json({ error: "Acesso negado. Você não é um administrador." });
  };
  
  export default isAdmin;