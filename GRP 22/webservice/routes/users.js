var express = require('express');
var router = express.Router();

// Rota para a lista de usuários "/"
router.get('/', function (req, res, next) {
  // Responde com o texto "respond with a resource"
  res.send('respond with a resource');
});

module.exports = router;
