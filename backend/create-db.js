const mysql = require('mysql2/promise');

async function createDb() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });
    console.log('Connected to MySQL successfully.');
    await connection.query('CREATE DATABASE IF NOT EXISTS prokasey_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
    console.log('Database prokasey_db created or already exists.');
    await connection.end();
  } catch (err) {
    console.error('Error connecting to MySQL:', err.message);
  }
}

createDb();
