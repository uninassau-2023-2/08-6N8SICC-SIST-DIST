const mysql = require("mysql");

const db = mysql.createConnection({
  host: "172.17.0.1",
  user: "aula",
  password: "aula",
  port: 33062,
  database: "controle_atendimento",
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err);
    throw err;
  }
  console.log("Conectado ao MySQL");
});

module.exports = db;
