require("dotenv").config(); // Încarcă variabilele de mediu din fișierul .env
const express = require("express"); // Importă framework-ul Express
const session = require("express-session"); // Importă middleware-ul pentru sesiuni
const scheduler = require("./scripts/scheduler"); // Importă scriptul pentru scheduler
const MySQLStore = require("express-mysql-session")(session); // Importă MySQLStore pentru a stoca sesiunile în baza de date MySQL
const cors = require("cors"); // Importă middleware-ul CORS pentru a permite cereri din alte origini
const app = express(); // Creează o instanță a aplicației Express
const port = 3001; // Definește portul pe care va rula serverul

// Opțiuni pentru MySQLStore
const options = {
  host: "localhost", // Adresa gazdei pentru baza de date
  port: 3306, // Portul pe care rulează serverul MySQL
  user: "root", // Numele de utilizator pentru baza de date
  database: "gym_booking_system", // Numele bazei de date
  password: "", // Parola pentru baza de date
};

const sessionStore = new MySQLStore(options); // Creează o instanță MySQLStore pentru a stoca sesiunile

app.use(
  session({
    secret: "secretulMeu", // Un secret folosit pentru a semna cookie-ul de sesiune
    resave: false, // Nu resalvează sesiunea dacă nu a fost modificată
    saveUninitialized: false, // Nu salvează sesiuni neinițializate
    store: sessionStore, // Stochează sesiunea în baza de date MySQL
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // Durata de viață a cookie-ului de sesiune: 1 zi
  })
);

app.use(
  cors({
    origin: "http://localhost:3000", // Originea specifică a frontend-ului
    credentials: true, // Permite cookie-uri pentru sesiune
  })
);

app.use(express.json()); // Middleware pentru a parsa cererile de tip application/json
app.use(express.urlencoded({ extended: true })); // Middleware pentru a parsa cererile de tip application/x-www-form-urlencoded

// Importarea rutelor
const userRoutes = require("./routes/userRoutes");
const gymRoutes = require("./routes/gymRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const timeSlotRoutes = require("./routes/timeSlotRoutes");

// Utilizarea rutelor
app.use("/api/users", userRoutes);
app.use("/api/gyms", gymRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/timeslots", timeSlotRoutes);

// Rută de testare pentru răspunsul serverului
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Pornește task-ul de curățare a rezervărilor
scheduler.startBookingCleanupTask();

// Pornește serverul și ascultă pe portul specificat
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
