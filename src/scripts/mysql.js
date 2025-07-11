// migration/mysql.js
const mysql = require('mysql2/promise');

async function connectMySQL() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'sys'
  });
  return connection;
}

module.exports = { connectMySQL };
