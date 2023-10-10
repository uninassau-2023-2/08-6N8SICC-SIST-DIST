// Importa os módulos necessários
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');

// Importa as rotas
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var accessRouter = require('./routes/access');
var ultimaSenhaRouter = require('./routes/ultimaSenha');
var solicitarSenhaRouter = require('./routes/solicitarSenha');
var senhasChamadasRouter = require('./routes/senhasChamadas');
var relatoriosRouter = require('./routes/relatorios');

var app = express();

// Configuração do motor de visualização
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Configuração de middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Middleware para compilar SASS para CSS
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));

// Servindo arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Define as rotas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/access', accessRouter);
app.use('/ultimaSenha', ultimaSenhaRouter);
app.use('/solicitarSenha', solicitarSenhaRouter);
app.use('/senhasChamadas', senhasChamadasRouter);
app.use('/relatorios', relatoriosRouter);
app.use('/se', solicitarSenhaRouter);
app.use('/sg', solicitarSenhaRouter);
app.use('/sp', solicitarSenhaRouter);

// Manipulador de erro para lidar com erros 404
app.use(function (req, res, next) {
  next(createError(404));
});

// Manipulador de erro para lidar com outros erros
app.use(function (err, req, res, next) {
  // Define as variáveis locais para a renderização do erro
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Renderiza a página de erro
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
