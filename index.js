require('dotenv').config();
const http = require('http');
const mysql = require('mysql2');

// Usar las variables de entorno
const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err.message);
    return;
  }
  console.log('✅ Conectado a MySQL correctamente');
  connection.end();
});

server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`Conectando a BD: ${DB_HOST}/${DB_NAME}`);
  console.log(`Entorno: ${process.env.NODE_ENV}`);
});

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`¡Servidor en puerto ${PORT}! BD: ${DB_NAME}\n`);
});


