// src/models/senhaModel.js
const db = require("../db/db");

// Defina o modelo de dados para a tabela de senhas
const Senha = {
  tableName: "senhas", // Nome da tabela no banco de dados

  // Função para criar uma nova senha
  create: async (numero_senha, tipo_senha) => {
    try {
      const [result] = await db.query(
        "INSERT INTO senhas (numero_senha, tipo_senha, atendida) VALUES (?, ?, FALSE)",
        [numero_senha, tipo_senha]
      );
      return result.insertId; // Retorna o ID da senha inserida
    } catch (error) {
      throw new Error("Erro ao criar uma nova senha");
    }
  },

  // Função para buscar a próxima senha não atendida
  findNextUnattended: async (tipo_senha) => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM senhas WHERE tipo_senha = ? AND atendida = FALSE ORDER BY data_emissao ASC LIMIT 1",
        [tipo_senha]
      );
      if (rows.length > 0) {
        return rows[0];
      } else {
        return null; // Nenhuma senha disponível
      }
    } catch (error) {
      throw new Error("Erro ao buscar a próxima senha não atendida");
    }
  },

  // Função para marcar uma senha como atendida
  markAsAttended: async (senhaId) => {
    try {
      await db.query("UPDATE senhas SET atendida = TRUE WHERE id = ?", [
        senhaId,
      ]);
    } catch (error) {
      throw new Error("Erro ao marcar a senha como atendida");
    }
  },

  // Função para obter um relatório de todas as senhas
  getAll: async () => {
    try {
      const [rows] = await db.query("SELECT * FROM senhas");
      return rows;
    } catch (error) {
      throw new Error("Erro ao obter o relatório de senhas");
    }
  },
};

module.exports = Senha;
