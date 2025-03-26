require("dotenv").config();
const express = require("express");
const session = require("express-session");
const scheduler = require("./scripts/scheduler");
const MySQLStore = require("express-mysql-session")(session);
const cors = require("cors");
const app = express();
const port = 3001;

const options = {
  host: "localhost",
  port: 3306,
  user: "root",
  database: "gym_booking_system",
  password: "",
};

const sessionStore = new MySQLStore(options);

app.use(
  session({
    secret: "secretulMeu",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require("./routes/userRoutes");
const gymRoutes = require("./routes/gymRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const timeSlotRoutes = require("./routes/timeSlotRoutes");

app.use("/api/users", userRoutes);
app.use("/api/gyms", gymRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/timeslots", timeSlotRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

scheduler.startBookingCleanupTask();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
