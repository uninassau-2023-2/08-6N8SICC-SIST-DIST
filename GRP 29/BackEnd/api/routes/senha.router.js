const SenhaController = require('../controller/SenhaController');

module.exports = (server, routes, prefix = '/api/senha') => {
  routes.post('/', SenhaController.create); //emitir senha
  routes.get('/', SenhaController.findAll); //retorna todas as senhas chamadas
  routes.get('/chamar/:guiche', SenhaController.find); //chamar senha
  routes.get('/chamar/SG/:guiche', SenhaController.chamarSenhaSG); // chamar senha SG
  routes.get('/chamar/SP/:guiche', SenhaController.chamarSenhaSP); // chamar senha SP
  routes.get('/chamar/SE/:guiche', SenhaController.chamarSenhaSE); // chamar senha SE
  routes.get('/relatorio', SenhaController.relatorio)
  server.use(prefix, routes);
};
