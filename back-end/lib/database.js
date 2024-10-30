const mysql = require("mysql2/promise");

// Crearea unui pool de conexiuni la baza de date MySQL
const pool = mysql.createPool({
  host: "localhost", // Gazda bazei de date
  user: "root", // Utilizatorul bazei de date
  password: "", // Parola utilizatorului bazei de date
  database: "gym_booking_system", // Numele bazei de date
  waitForConnections: true, // Așteaptă conexiuni disponibile dacă pool-ul este plin
  connectionLimit: 10, // Numărul maxim de conexiuni în pool
  queueLimit: 0, // Numărul maxim de cereri de conexiune în așteptare (0 înseamnă fără limită)
});

// Exportarea pool-ului pentru a fi utilizat în alte module
module.exports = pool;
