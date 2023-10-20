const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// Configuração do pool de conexão com o banco de dados
const pool = mysql.createPool({
    connectionLimit: 10, // Limite máximo de conexões simultâneas
    host:     'localhost',
    user:     'user',
    password: 'password',
    database: 'tabelaSenhas',
});

// Rota para a página "senhasChamadas"
router.get('/', function (req, res, next) {
    // Obtém uma conexão do pool
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Erro ao obter conexão do pool:', err);
            throw err;
        }

        console.log('Conexão obtida do pool.');

        // Realiza a consulta SQL
        const sql = 'SELECT * FROM access ORDER BY idaccess DESC LIMIT 5';

        connection.query(sql, (err, results) => {
            if (err) {
                console.error('Erro na consulta ao banco de dados:', err);
                throw err;
            }

            console.log('Registros encontrados:');
            console.log(results);

            // Mapeia os resultados para incluir o guichê a partir do IP
            const formattedResults = results.map(result => ({
                senha: result.senha,
                guiche: extractLastOctet(result.ip),
            }));

            console.log('Resultados formatados:');
            console.log(formattedResults);

            // Libera a conexão de volta para o pool
            connection.release();

            console.log('Conexão retornada ao pool.');

            // Renderiza a página "senhasChamadas" com os resultados da consulta
            res.render('senhasChamadas', {
                title: 'Senhas Chamadas',
                results: formattedResults,
            });
        });
    });
});

function extractLastOctet(ip) {
    console.log('Endereço IP:', ip);
    const match = ip.match(/(\d+)\.(\d+)\.(\d+)\.(\d+)/);
    if (match) {
        return match[4]; // Retorna o quarto grupo capturado, que é o último octeto
    } else {
        return 'Endereço IP inválido';
    }
}

module.exports = router;
