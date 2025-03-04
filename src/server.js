import app from "./app.js";

const PORT = process.env.PORT || 5050;

app.listen(PORT, () =>
  console.log(`Servidor rodando em Local Host: http://localhost:5000`)
);
