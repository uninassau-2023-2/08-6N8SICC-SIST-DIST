const senhaService = require("../services/senhaService");

async function emitirSenha(req, res) {
  const { tipo } = req.body;
  try {
    const senha = await senhaService.emitirSenha(tipo);
    res.status(200).json({ senha });
  } catch (error) {
    res.status(500).json({ message: "Erro ao emitir a senha" });
  }
}

async function chamarProximaSenha(req, res) {
  try {
    const proximaSenha = await senhaService.chamarProximaSenha();
    res.status(200).json(proximaSenha);
  } catch (error) {
    if (error.message === "Fora do horário de expediente") {
      res.status(404).json({ message: "Fora do horário de expediente" });
    } else {
      res.status(500).json({ message: "Erro ao chamar a próxima senha" });
    }
  }
}

async function relatorioSenhas(req, res) {
  try {
    const senhas = await senhaService.obterRelatorioSenhas();
    res.status(200).json(senhas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter o relatório de senhas" });
  }
}

module.exports = {
  emitirSenha,
  chamarProximaSenha,
  relatorioSenhas,
};
