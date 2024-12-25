const { ENV_VAR } = require("../../utils/envConstants");

const config = {
  development: {
    username: ENV_VAR.DB_USER,
    password: ENV_VAR.DB_PASSWORD,
    database: ENV_VAR.DB_NAME,
    host: ENV_VAR.DB_HOST,
    port: ENV_VAR.DB_PORT,
    dialect: ENV_VAR.DB_DIALECT || "postgres",
  },
  production: {
    username: ENV_VAR.DB_USER,
    password: ENV_VAR.DB_PASSWORD,
    database: ENV_VAR.DB_NAME,
    host: ENV_VAR.DB_HOST,
    port: ENV_VAR.DB_PORT,
    dialect: ENV_VAR.DB_DIALECT || "postgres",
  },
};

module.exports = config[ENV_VAR.NODE_ENV || "development"];
