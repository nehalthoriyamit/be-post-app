require("dotenv").config();

const ENV_VAR = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,

  // Supabase credentials
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,

  // Database credentials
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  DB_DIALECT: process.env.DB_DIALECT,
  SECRET_KEY: process.env.SECRET_KEY,
};
module.exports = { ENV_VAR };
