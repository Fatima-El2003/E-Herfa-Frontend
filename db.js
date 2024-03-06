const mysql = require('mysql');

function createDBConnection() {
  // Create a MySQL connection pool
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'eherfa',
  });

  return pool;
}

module.exports = createDBConnection;
