var fs = require('fs');
var HandleDBMSMySQL = require('../config/database/HandleDBMSMySQL');

class ModelAccess {

  constructor() {
    // Inicializa a instância do HandleDBMSMySQL para lidar com o banco de dados
    this._HandleDBMSMySQL = new HandleDBMSMySQL();
  }

  // Método para destruir a instância com um erro personalizado
  destroy(param = null) {
    var varToString = varObj => Object.keys(varObj)[0];
    throw new Error('Parâmetros incorretos para a classe: `%s`, parâmetro `%s`', this.constructor.name, varToString({ param }));
  }

  // Método para obter registros de acesso
  getAccess(limit = 0, offset = 0) {
    var envFile = JSON.parse(fs.readFileSync('./config/server/env.json', 'utf8', 'r'));
    var _limit = limit;
    var _offset = offset;
    var sql = '';

    if (_limit === null && _offset === null) {
      sql = `select * from ` + envFile.database + `.access order by idaccess desc`;
    } else if (typeof _limit === 'number' && _limit >= 0 && typeof _offset === 'number' && _offset >= 1) {
      sql = `select * from ` + envFile.database + `.access order by idaccess desc limit ` + _limit + `, ` + _offset;
    } else {
      console.error('Parâmetros incorretos para a classe: `%s`', this.constructor.name);
    }

    return this._HandleDBMSMySQL.query(sql);
  }

  // Método para inserir um registro de acesso
  postAccess(timestamp = null, hostname = null, ip = null) {
    this._timestamp = (typeof timestamp !== 'string' || timestamp === null) ? this.destroy(timestamp) : timestamp;
    this._hostname = (typeof hostname !== 'string' || hostname === null) ? this.destroy(hostname) : hostname;
    this._ip = (typeof ip !== 'string' || ip === null) ? this.destroy(ip) : ip;

    var envFile = JSON.parse(fs.readFileSync('./config/server/env.json', 'utf8', 'r'));
    var sqlInsert = `insert into ${envFile.database}.access values (null, '${this._timestamp}', '${this._hostname}', '${this._ip}')`;

    return this._HandleDBMSMySQL.insert(sqlInsert);
  }
}

module.exports = ModelAccess;
