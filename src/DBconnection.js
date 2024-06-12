const util = require('util');
const { Pool } = require('pg');
require('dotenv').config();
const log4js = require('log4js');
const logger = log4js.getLogger(__filename.slice(__dirname.length + 1));

const postgresPoolObject = {
    connectionLimit: 10,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    // port: process.env.DB_PORT,
  };

const pool = new Pool(postgresPoolObject);

pool.connect((err, client, done) => {
  if (err) {
    // logger.error("Error while connecting to Database: " + err);
    if (err.code === 'ECONNREFUSED') {
    console.log("Database connection was refused");
    }
  }
  done(); // Release the client back to the pool
});

// Promisify for Node.js async/await.
pool.query = util.promisify(pool.query);

module.exports = pool;
