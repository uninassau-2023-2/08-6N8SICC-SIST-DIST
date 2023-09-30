const createDatabaseConnection = require("../db/db");

async function emitirSenha(tipo) {
  const db = await createDatabaseConnection();
  try {
    const data = new Date();
    const prefixoData = `${data.getFullYear()}${(data.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${data.getDate().toString().padStart(2, "0")}-${tipo}`;
    const [rows] = await db.query(
      "SELECT numero_senha FROM senhas WHERE numero_senha LIKE ? ORDER BY numero_senha DESC LIMIT 1",
      [`${prefixoData}%`]
    );

    let sequencia = 1;

    if (rows.length) {
      const ultimaSequencia = parseInt(
        rows[0].numero_senha.split("-")[1].slice(2)
      );
      sequencia = ultimaSequencia + 1;
    }

    const numero_senha = `${prefixoData}${sequencia
      .toString()
      .padStart(3, "0")}`;

    const [result] = await db.query(
      "INSERT INTO senhas (numero_senha, tipo_senha) VALUES (?, ?)",
      [numero_senha, tipo]
    );

    return numero_senha;
  } catch (error) {
    throw new Error("Erro ao emitir a senha: " + error.message);
  }
}

async function chamarProximaSenha() {
  const db = await createDatabaseConnection();
  try {
    const now = new Date();
    if (now.getHours() < 7 || now.getHours() >= 17) {
      throw new Error("Fora do horário de expediente");
    }

    let ultimaSenhaChamadaTipo = null;
    let proximaSenha = null;

    if (proximaSenha) {
      await db.query("UPDATE senhas SET atendida = TRUE WHERE id = ?", [
        proximaSenha.id,
      ]);

      return {
        message: `Chamando senha ${proximaSenha.numero_senha}`,
        tm: proximaSenha.tm,
      };
    } else {
      throw new Error("Nenhuma senha disponível");
    }
  } catch (error) {
    throw error;
  }
}

async function obterRelatorioSenhas() {
  const db = await createDatabaseConnection();
  try {
    const [rows] = await db.query("SELECT * FROM senhas");
    return rows;
  } catch (error) {
    throw new Error("Erro ao obter o relatório de senhas");
  }
}

module.exports = {
  emitirSenha,
  chamarProximaSenha,
  obterRelatorioSenhas,
};
