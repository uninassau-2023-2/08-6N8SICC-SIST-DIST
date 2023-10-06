const NotFound = require('./NotFound');
// const NotEnabled = require('./NotEnabled');

module.exports = (error) => {
  let status = 500;
  if (error instanceof NotFound) {
    status = 404;
  }

  return status;
};
