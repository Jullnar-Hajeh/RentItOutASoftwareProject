const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "RentItOut API",
      description: "RentItOut API Information",
      contact: {
        name: "Developer",
      },
      servers: ["http://localhost:3000"],
    },
  },
  apis: ["./routes/*.js"], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
