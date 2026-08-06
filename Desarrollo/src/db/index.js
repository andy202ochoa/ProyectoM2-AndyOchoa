const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});


async function testDB() {
  try {
  const result = await pool.query(`
    SELECT current_database(), current_user, inet_server_addr();
  `);

    console.log(result.rows);
  } catch (error) {
    console.error(error);
  }
}

module.exports = pool;

//aqui hay un error, revisar luego