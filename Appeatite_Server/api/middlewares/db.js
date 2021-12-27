const { Pool } = require('pg');

const connections = new Pool({
  max: 20,
  connectionString: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASS}@${process.env.POSTGRES_HOST}:5432/${process.env.POSTGRES_DB}`,
  idleTimeoutMillis: 30000
});

module.exports = connections;
