const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  // En Vercel cada función abre su propio pool: se limita para no agotar
  // las conexiones de la base de datos.
  max: process.env.VERCEL ? 3 : 10,
});

module.exports = pool;
