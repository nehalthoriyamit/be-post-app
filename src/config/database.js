const { Sequelize } = require("sequelize");
const { ENV_VAR } = require("../utils/envConstants");

const sequelize = new Sequelize(
  ENV_VAR.DB_NAME,
  ENV_VAR.DB_USER,
  ENV_VAR.DB_PASSWORD,
  {
    dialect: ENV_VAR.DB_DIALECT || "postgres",
    host: ENV_VAR.DB_HOST,
    port: ENV_VAR.DB_PORT,
    username: ENV_VAR.DB_USER,
    password: ENV_VAR.DB_PASSWORD,
    database: ENV_VAR.DB_NAME,
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully."))
  .catch((err) => console.error("Unable to connect to the database:", err));

module.exports = sequelize;
