const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const createDatabaseConnection = require("../nodejs/src/db/db");

app.use(express.json());

app.use(cors());

/**
 * @swagger
 * /api/emitirSenha:
 *   post:
 *     summary: Emitir uma nova senha
 *     description: Cria uma nova senha com base no tipo especificado (SP, SG, SE).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 description: O tipo de senha a ser emitido (SP, SG, SE).
 *     responses:
 *       200:
 *         description: Senha emitida com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 senha:
 *                   type: string
 *                   description: O número da senha emitida.
 */
app.post("/api/emitirSenha", async (req, res) => {
  try {
    const db = await createDatabaseConnection();
    const tipo_senha = req.body.tipo;
    const data = new Date();

    const prefixoData = `${data.getFullYear()}${(data.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${data
      .getDate()
      .toString()
      .padStart(2, "0")}-${tipo_senha}`;

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
      [numero_senha, tipo_senha]
    );
    res.json({ senha: numero_senha });
  } catch (error) {
    console.error("Erro ao emitir a senha: ", error);
    res.status(500).json({ error: "Erro ao emitir a senha" });
  }
});

/**
 * @swagger
 * /api/chamarProximaSenha:
 *   get:
 *     summary: Chamar a próxima senha
 *     description: Busca a próxima senha não atendida e a marca como atendida.
 *     responses:
 *       200:
 *         description: Senha chamada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: O ID da senha chamada.
 *                 numero_senha:
 *                   type: string
 *                   description: O número da senha chamada.
 *                 tipo_senha:
 *                   type: string
 *                   description: O tipo de senha chamada (SP, SG, SE).
 *       404:
 *         description: Nenhuma senha disponível.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro quando nenhuma senha está disponível.
 */
app.get("/api/chamarProximaSenha", async (req, res) => {
  const db = await createDatabaseConnection();
  const [rows] = await db.query(
    "SELECT * FROM senhas WHERE atendida = FALSE ORDER BY tm ASC LIMIT 1"
  );
  if (rows.length > 0) {
    const senha = rows[0];
    await db.query("UPDATE senhas SET atendida = TRUE WHERE id = ?", [
      senha.id,
    ]);
    res.json(senha);
  } else {
    res.status(404).json({ message: "Nenhuma senha disponível" });
  }
});

/**
 * @swagger
 * /api/relatorioSenhas:
 *   get:
 *     summary: Obter relatório de senhas
 *     description: Retorna um relatório de todas as senhas.
 *     responses:
 *       200:
 *         description: Relatório de senhas recuperado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: O ID da senha.
 *                   numero_senha:
 *                     type: string
 *                     description: O número da senha.
 *                   tipo_senha:
 *                     type: string
 *                     description: O tipo de senha (SP, SG, SE).
 *                   atendida:
 *                     type: boolean
 *                     description: Indica se a senha foi atendida ou não.
 *                   data_emissao:
 *                     type: string
 *                     format: date-time
 *                     description: Data e hora de emissão da senha.
 */
app.get("/api/relatorioSenhas", async (req, res) => {
  const db = await createDatabaseConnection();
  const [rows] = await db.query("SELECT * FROM senhas");
  res.json(rows);
});

app.get("/solicitar-senha/:tipo", (req, res) => {});

app.get("/api/chamarProximaSenha", async (req, res) => {
  const db = await createDatabaseConnection();
  let senhas = {
    SP: [],
    SE: [],
    SG: [],
  };

  let ultimaSenhaChamadaTipo = null;

  const now = new Date();
  if (now.getHours() < 7 || now.getHours() >= 17) {
    return res.status(404).json({ message: "Fora do horário de expediente" });
  }

  let proximaSenha = null;

  if (ultimaSenhaChamadaTipo === "SP" || ultimaSenhaChamadaTipo === null) {
    const [rowsSP] = await db.query(
      "SELECT * FROM senhas WHERE tipo_senha = 'SP' AND atendida = FALSE ORDER BY data_emissao ASC LIMIT 1"
    );
    if (rowsSP.length > 0) {
      proximaSenha = rowsSP[0];
      ultimaSenhaChamadaTipo = "SP";
      const tempoMedio = 5 + Math.floor(Math.random() * 11);
      proximaSenha.tm = tempoMedio;
    }
  } else if (
    ultimaSenhaChamadaTipo === "SE" ||
    ultimaSenhaChamadaTipo === "SG"
  ) {
    const [rowsSE] = await db.query(
      "SELECT * FROM senhas WHERE tipo_senha = 'SE' AND atendida = FALSE ORDER BY data_emissao ASC LIMIT 1"
    );
    if (rowsSE.length > 0) {
      proximaSenha = rowsSE[0];
      ultimaSenhaChamadaTipo = "SE";
      const tempoMedio = Math.random() < 0.05 ? 5 : 1;
      proximaSenha.tm = tempoMedio;
    } else {
      const [rowsSG] = await db.query(
        "SELECT * FROM senhas WHERE tipo_senha = 'SG' AND atendida = FALSE ORDER BY data_emissao ASC LIMIT 1"
      );
      if (rowsSG.length > 0) {
        proximaSenha = rowsSG[0];
        ultimaSenhaChamadaTipo = "SG";
        const tempoMedio = 3 + Math.floor(Math.random() * 7);
        proximaSenha.tm = tempoMedio;
      }
    }
  }

  if (proximaSenha) {
    await db.query("UPDATE senhas SET atendida = TRUE WHERE id = ?", [
      proximaSenha.id,
    ]);
    res.json({
      message: `Chamando senha ${proximaSenha.numero_senha}`,
      tm: proximaSenha.tm,
    });
  } else {
    res.status(404).json({ message: "Nenhuma senha disponível" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API com Swagger",
    version: "1.0.0",
    description: "Documentação da API com Swagger",
  },
};

const options = {
  swaggerDefinition,
  apis: ["app.js"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
