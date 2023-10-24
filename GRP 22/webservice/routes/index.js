var express = require('express');
var router = express.Router();

// Rota para a página inicial "/"
router.get('/', function (req, res, next) {
  // Renderiza a página "index" com o título "Express"
  res.render('index', { title: 'Express' });
});

module.exports = router;
