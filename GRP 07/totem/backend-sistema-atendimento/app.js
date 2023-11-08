const express = require("express");
const app = express();
const atendimentoRoutes = require("./src/routes/atendimento");

// Outras configurações, middlewares, etc.

// Use as rotas do atendimento
app.use("/", atendimentoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express rodando na porta ${PORT}`);
});
