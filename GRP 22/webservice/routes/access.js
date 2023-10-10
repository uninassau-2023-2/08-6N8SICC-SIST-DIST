var express = require('express');
var ip = require('ip');
var os = require('os');
var fs = require('fs'); // Importa o módulo 'fs' para trabalhar com arquivos
var path = require('path'); // Importa o módulo 'path' para lidar com caminhos de arquivos

var router = express.Router();

var ModelAccess = require('../model/ModelAccess');

var _ModelAccess = new ModelAccess();

// Função para gerar senhas sequenciais
function gerarSenhaSequencial(tipoSenha) {
    const sequenciaFilePath = path.join(__dirname, '../sequences', `${tipoSenha}.txt`); // Caminho para o arquivo de sequência correspondente ao tipo de senha
    let numeroSequencial = parseInt(fs.readFileSync(sequenciaFilePath, 'utf8'), 10);    // Lê o número sequencial atual do arquivo
    numeroSequencial++;                                                         // Incrementa o número sequencial
    const numeroFormatado = numeroSequencial.toString().padStart(2, '0');       // Formata o número sequencial com dois dígitos
    fs.writeFileSync(sequenciaFilePath, numeroSequencial.toString(), 'utf8');   // Atualiza o arquivo de sequência com o novo número sequencial

    return numeroFormatado;
}

// Função para redefinir sequências de senha diariamente à meia-noite
function resetSequencesDaily() {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {   // Definido reset de senhas para 00:00h, altere para 18:00h se for o caso
        console.log('Redefinindo sequências diariamente à meia-noite.');
        const tiposSenhaARedefinir = ['SG', 'SP', 'SE'];    // Tipos de senha que você deseja redefinir diariamente        
        tiposSenhaARedefinir.forEach(tipoSenha => {         // Para cada tipo de senha, defina a sequência de volta para 0
            const sequenciaFilePath = path.join(__dirname, '../sequences', `${tipoSenha}.txt`);
            fs.writeFileSync(sequenciaFilePath, '0', 'utf8');
        });
    }
}
// Executa a função a cada minuto para verificar se é meia-noite e redefinir sequências
setInterval(resetSequencesDaily, 60000); // A cada 1 minuto

router.route('/')
    .get(function (req, res, next) {
        // Manipula a requisição GET para obter dados de acesso
        _ModelAccess.getAccess(null, null)
            .then(resultJSON => {
                res.status(200).json(resultJSON).end();                             // Responde com os dados obtidos em JSON
            })
            .catch(err => {
                console.error('Erro na requisição `get` para o recurso: ' + err);   // Em caso de erro, responde com status 500 (Erro interno do servidor)
                res.status(500).send(err).end();
            });
    })

    .put(function (req, res) {
        res.send('Não há ação de atualização nesta rota.');
    })

    .delete(function (req, res) {
        res.send('Não há ação de apagar/deletar.');
    })

    .post(function (req, res) {
        const toDay = new Date();
        const tipoSenha = req.body.tipoSenha; // Obtém o valor do campo "tipoSenha" do corpo da requisição

        // Verifica o valor de "tipoSenha" e gera a senha correspondente
        let senhaPrefixo = '';
        if (tipoSenha === 'SP') {
            senhaPrefixo = 'SP';
        } else if (tipoSenha === 'SG') {
            senhaPrefixo = 'SG';
        } else if (tipoSenha === 'SE') {
            senhaPrefixo = 'SE';
        } else {
            // Se o valor de "tipoSenha" não for nenhum dos esperados, retorna um erro
            const errorMessage = 'Valor inválido para o campo "tipoSenha". Deve ser SP, SG ou SE.';
            console.error(errorMessage);
            return res.status(400).send(errorMessage);
        }

        // Gere o número sequencial para a senha
        const numeroSequencial = gerarSenhaSequencial(tipoSenha);

        const timestamp = Date.now().toString(); // Gera o timestamp para a senha

        // Monta a senha completa
        const senhaCompleta = `${toDay.getFullYear() % 100}${(toDay.getMonth() + 1).toString().padStart(2, '0')}${toDay.getDate().toString().padStart(2, '0')}-${senhaPrefixo}${numeroSequencial}`;

        // Chama a função para inserir a senha no banco de dados
        _ModelAccess.postAccess(timestamp, senhaCompleta, ip.address().toString())
            .then(resultJSON => {
                res.status(201).json(resultJSON).end();                             // Responde com os dados inseridos em JSON e status 201 (Criado)
            })
            .catch(err => {
                console.error('Erro na requisição `post` para o recurso: ' + err);  // Em caso de erro, responde com status 500 (Erro interno do servidor)
                res.status(500).send(err).end();
            });
    });

module.exports = router;
