const mysql = require('mysql2/promise');

require('dotenv').config();
console.log('Connecting to database:', process.env.MYSQL_HOST, process.env.MYSQL_USER, process.env.MYSQL_DB);

const connection = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    port:3306
});

module.exports = connection;