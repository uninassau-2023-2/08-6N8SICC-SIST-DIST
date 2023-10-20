var mysql = require('mysql');
var fs = require('fs');

class HandleDBMSMySQL {

  // O construtor aceita parâmetros de conexão ou lê do arquivo de configuração
  constructor(host = null, database = null, user = null, password = null, port = null) {
    // Lê as informações de conexão do arquivo de configuração
    var sessionFile = JSON.parse(fs.readFileSync('./config/server/env.json', 'utf8', 'r'));
    if (sessionFile) {
      // Define os parâmetros de conexão com base nos argumentos ou no arquivo de configuração
      this._host = (typeof host !== 'string' || host == null) ? sessionFile.host : host;
      this._database = (typeof database !== 'string' || database == null) ? sessionFile.database : database;
      this._user = (typeof user !== 'string' || user == null) ? sessionFile.user : user;
      this._password = (typeof password !== 'string' || password == null) ? sessionFile.password : password;
      this._port = sessionFile.port;
      // Estabelece a conexão com o banco de dados
      this.connect();
    } else {
      console.error('Parâmetros incorretos para a classe: `%s`', this.constructor.name);
    }
  }

  // Método para estabelecer a conexão com o banco de dados
  connect() {
    this.connection = mysql.createConnection({
      host: this._host,
      database: this._database,
      user: this._user,
      password: this._password,
      port: this._port
    });
  }

  // Método para executar uma consulta SQL
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          var resultsJSON = { 'metadata': {}, 'data': {} };
          resultsJSON.metadata = fields.map((r) => Object.assign({}, r));
          resultsJSON.data = results.map((r) => Object.assign({}, r));
          resolve(resultsJSON);
        }
      });
    });
  }

  // Método para executar uma inserção SQL
  insert(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  // Método para fechar a conexão com o banco de dados
  close() {
    return new Promise((resolve, reject) => {
      this.connection.end(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = HandleDBMSMySQL;
