const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'agrirent',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
});

const connectDB = async () => {
  try {
    // Attempt connection to host (without database first in case database needs auto-creating)
    const initConnection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: Number(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      multipleStatements: true
    });

    const dbName = process.env.MYSQL_DATABASE || 'agrirent';
    await initConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await initConnection.query(`USE \`${dbName}\`;`);

    // Auto-create database schema tables if schema.sql exists
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await initConnection.query(schemaSql);
    }
    await initConnection.end();

    // Verify connection pool
    const connection = await pool.getConnection();
    console.log(`🐬 MySQL Connected: Database '${dbName}' ready on ${process.env.MYSQL_HOST || 'localhost'}:${process.env.MYSQL_PORT || 3306}`);
    connection.release();
  } catch (error) {
    console.error(`❌ MySQL Connection Error: ${error.message}`);
  }
};

connectDB.pool = pool;

module.exports = connectDB;
