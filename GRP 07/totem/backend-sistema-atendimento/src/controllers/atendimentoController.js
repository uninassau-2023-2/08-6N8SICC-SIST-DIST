const db = require("../config/database");
const gerarSenha = require("../utils/gerarSenha");

exports.emitirSenhaSP = (req, res) => {
  const senhaSP = gerarSenha("SP");
  const prioridade = 1;

  const sql =
    "INSERT INTO senhas_emitidas (numero_senha, tipo_senha, data_emissao, prioridade) VALUES (?, ?, ?, ?)";
  const values = [senhaSP, "SP", new Date(), prioridade];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Erro ao inserir senhaSP no banco de dados:", err);
      res.status(500).json({ error: "Erro ao emitir senha" });
      return;
    }

    console.log("SenhaSP inserida no banco de dados com sucesso:", result);
    res.json({ senha: senhaSP });
  });
};

exports.emitirSenhaSG = (req, res) => {
  const senhaSG = gerarSenha("SG");
  const prioridade = 2;

  const sql =
    "INSERT INTO senhas_emitidas (numero_senha, tipo_senha, data_emissao, prioridade) VALUES (?, ?, ?, ?)";
  const values = [senhaSG, "SG", new Date(), prioridade];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Erro ao inserir senhaSG no banco de dados:", err);
      res.status(500).json({ error: "Erro ao emitir senha" });
      return;
    }

    console.log("SenhaSG inserida no banco de dados com sucesso:", result);
    res.json({ senha: senhaSG });
  });
};

exports.emitirSenhaSE = (req, res) => {
  const senhaSE = gerarSenha("SE");
  const prioridade = 2;

  const sql =
    "INSERT INTO senhas_emitidas (numero_senha, tipo_senha, data_emissao, prioridade) VALUES (?, ?, ?, ?)";
  const values = [senhaSE, "SE", new Date(), prioridade];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Erro ao inserir senhaSE no banco de dados:", err);
      res.status(500).json({ error: "Erro ao emitir senha" });
      return;
    }

    console.log("SenhaSE inserida no banco de dados com sucesso:", result);
    res.json({ senha: senhaSE });
  });
};

exports.proximaSenha = (req, res) => {
  db.query(
    "SELECT * FROM senhas_emitidas WHERE data_atendimento IS NULL ORDER BY prioridade, data_emissao LIMIT 1",
    (err, result) => {
      if (err) {
        console.error("Erro ao buscar próxima senha:", err);
        res.status(500).json({ error: "Erro ao buscar a próxima senha" });
        return;
      }

      if (result.length > 0) {
        const senha = result[0].numero_senha;

        const dataAtendimento = new Date();

        db.query(
          "UPDATE senhas_emitidas SET data_atendimento = ? WHERE numero_senha = ?",
          [dataAtendimento, senha],
          (updateErr, updateResult) => {
            if (updateErr) {
              console.error("Erro ao marcar a senha como atendida:", updateErr);
              res
                .status(500)
                .json({ error: "Erro ao marcar a senha como atendida" });
              return;
            }

            console.log(
              `Senha ${senha} marcada como atendida em ${dataAtendimento}`
            );
            res.json({ senha, data_atendimento: dataAtendimento });
          }
        );
      } else {
        res.json({ message: "Não há mais senhas a serem atendidas" });
      }
    }
  );
};

exports.relatorioDiario = (req, res) => {
  const dataAtual = new Date();
  const dataInicio = new Date(dataAtual);
  dataInicio.setHours(0, 0, 0, 0);

  const dataFim = new Date(dataAtual);
  dataFim.setHours(23, 59, 59, 999);

  const sql = `
      SELECT
        COUNT(*) AS total_emitidas,
        SUM(CASE WHEN data_atendimento IS NOT NULL THEN 1 ELSE 0 END) AS total_atendidas,
        SUM(CASE WHEN tipo_senha = 'SP' THEN 1 ELSE 0 END) AS sp_emitidas,
        SUM(CASE WHEN tipo_senha = 'SG' THEN 1 ELSE 0 END) AS sg_emitidas,
        SUM(CASE WHEN tipo_senha = 'SE' THEN 1 ELSE 0 END) AS se_emitidas,
        SUM(CASE WHEN tipo_senha = 'SP' AND data_atendimento IS NOT NULL THEN 1 ELSE 0 END) AS sp_atendidas,
        SUM(CASE WHEN tipo_senha = 'SG' AND data_atendimento IS NOT NULL THEN 1 ELSE 0 END) AS sg_atendidas,
        SUM(CASE WHEN tipo_senha = 'SE' AND data_atendimento IS NOT NULL THEN 1 ELSE 0 END) AS se_atendidas
      FROM senhas_emitidas
      WHERE data_emissao BETWEEN ? AND ?`;

  db.query(sql, [dataInicio, dataFim], (err, result) => {
    if (err) {
      console.error("Erro ao gerar o relatório diário:", err);
      res.status(500).json({ error: "Erro ao gerar o relatório diário" });
      return;
    }

    if (result.length > 0) {
      const relatorioDiario = result[0];
      res.json(relatorioDiario);
    } else {
      res.json({ message: "Não há dados disponíveis para o relatório diário" });
    }
  });
};

exports.relatorioMensal = (req, res) => {
  const dataAtual = new Date();
  const primeiroDiaDoMes = new Date(
    dataAtual.getFullYear(),
    dataAtual.getMonth(),
    1
  );
  const ultimoDiaDoMes = new Date(
    dataAtual.getFullYear(),
    dataAtual.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  const sql = `
      SELECT
        COUNT(*) AS total_emitidas,
        SUM(CASE WHEN data_atendimento IS NOT NULL THEN 1 ELSE 0 END) AS total_atendidas,
        SUM(CASE WHEN tipo_senha = 'SP' THEN 1 ELSE 0 END) AS sp_emitidas,
        SUM(CASE WHEN tipo_senha = 'SG' THEN 1 ELSE 0 END) AS sg_emitidas,
        SUM(CASE WHEN tipo_senha = 'SE' THEN 1 ELSE 0 END) AS se_emitidas,
        SUM(CASE WHEN tipo_senha = 'SP' AND data_atendimento IS NOT NULL THEN 1 ELSE 0 END) AS sp_atendidas,
        SUM(CASE WHEN tipo_senha = 'SG' AND data_atendimento IS NOT NULL THEN 1 ELSE 0 END) AS sg_atendidas,
        SUM(CASE WHEN tipo_senha = 'SE' AND data_atendimento IS NOT NULL THEN 1 ELSE 0 END) AS se_atendidas
      FROM senhas_emitidas
      WHERE data_emissao BETWEEN ? AND ?`;

  db.query(sql, [primeiroDiaDoMes, ultimoDiaDoMes], (err, result) => {
    if (err) {
      console.error("Erro ao gerar o relatório mensal:", err);
      res.status(500).json({ error: "Erro ao gerar o relatório mensal" });
      return;
    }

    if (result.length > 0) {
      const relatorioMensal = result[0];
      res.json(relatorioMensal);
    } else {
      res.json({ message: "Não há dados disponíveis para o relatório mensal" });
    }
  });
};
