const { Sequelize } = require('sequelize');
require('dotenv').config();

class Connection {
    constructor(){
        this.sequelizeDB();
    }


   async sequelizeDB(){

        const sequelize = new Sequelize(process.env.DATA_BASE, process.env.USERS, process.env.PASSWORD, {
          host: process.env.HOST,
          port: process.env.PORTA_DO_MYSQL,
          dialect: 'mysql'
        });

        try {
          await sequelize.authenticate();
          console.log('Conexão estabelecida com o banco de dados');
          this.sequelize = sequelize;
        } catch (error) {
          console.error('Erro ao estabelecer conexão com o banco de dados:', error);
        }

    }


}

module.exports = new Connection();