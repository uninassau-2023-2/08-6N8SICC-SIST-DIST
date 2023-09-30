const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API com Swagger",
    version: "1.0.0",
    description: "Documentação da API com Swagger",
  },
  basePath: "/",
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
