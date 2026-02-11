const path = require("path");

const SWAGGER_API_TITLE = "Leaderboard API";
const SWAGGER_API_VERSION = "1.0.0";
const SWAGGER_API_DESCRIPTION = "API documentation for the Leaderboard mock service";
const SWAGGER_DOCS_ROUTE = "/api-docs";
const API_BASE_PATH = "/api/v1";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: SWAGGER_API_TITLE,
      version: SWAGGER_API_VERSION,
      description: SWAGGER_API_DESCRIPTION,
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4444}`,
      },
    ],
  },
  apis: [path.join(__dirname, "./swagger.docs.js")],
};

module.exports = {
  swaggerOptions,
  SWAGGER_DOCS_ROUTE,
  API_BASE_PATH,
};
