var express = require('express');
var router = express.Router();

var ModelAccess = require('../model/ModelAccess');
var _ModelAccess = new ModelAccess();

router.get('/', function (req, res, next) {
  // Manipula a requisição POST para inserir dados de acesso
  _ModelAccess.getAccess(null, null)
    .then(resultJSON => {
      if (resultJSON.data.length > 0) {
        // Se houver pelo menos uma linha de dados na tabela
        const lastItem = resultJSON.data[0];            // O primeiro item será o último devido à ordenação
        res.status(200).send(JSON.stringify(lastItem)); // Envia o resultado como uma string JSON
      } else {
        // Se não houver dados na tabela, retorne uma mensagem apropriada
        res.status(200).send('Nenhum item encontrado na tabela.');
      }
    })
    .catch(err => {
      // Em caso de erro, responde com status 500 (Erro interno do servidor)
      console.error('Erro na requisição `get` para o recurso: ' + err);
      res.status(500).send(err).end();
    });

});

module.exports = router;

