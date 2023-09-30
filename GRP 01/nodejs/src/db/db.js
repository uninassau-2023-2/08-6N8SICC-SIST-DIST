const mysql = require("mysql2/promise");

async function createDatabaseConnection() {
  try {
    const db = await mysql.createConnection({
      host: "127.0.0.1",
      port: 3306,
      user: "develop",
      password: "develop",
      database: "sys",
    });

    console.log("Conectado ao MySQL");
    return db;
  } catch (err) {
    console.error("Erro ao conectar ao MySQL:", err);
    throw err;
  }
}

module.exports = createDatabaseConnection;
