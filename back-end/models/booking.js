const pool = require("../lib/database");
const {
  getTimeSlotById,
  decrementReservedCount,
  incrementReservedCount,
} = require("./timeSlot");
const { getGymById } = require("./gym");

// Funcție pentru crearea unei rezervări noi
const createBooking = async (booking) => {
  const { user_id: userId, timeslots_id: timeSlotId, status } = booking;

  await pool.query("START TRANSACTION"); // Începe o tranzacție

  try {
    // Verifică dacă utilizatorul are deja o rezervare activă
    const existingActiveBooking = await hasActiveBooking(userId);
    if (existingActiveBooking) {
      await pool.query("ROLLBACK");
      throw new Error("You already have an active booking.");
    }

    // Verifică disponibilitatea intervalului de timp și capacitatea sălii de sport
    const timeslot = await getTimeSlotById(timeSlotId);
    if (!timeslot) {
      await pool.query("ROLLBACK");
      throw new Error("The timeslot is not available or does not exist.");
    }
    const gym = await getGymById(timeslot.gym_id);

    if (timeslot.reservedCount >= gym.capacity) {
      await pool.query("ROLLBACK");
      throw new Error("There are no more available spots in this timeslot.");
    }

    // Creează rezervarea
    const sql =
      "INSERT INTO bookings (user_id, gym_id, timeslots_id, startTime, endTime, date, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')";
    const [result] = await pool.query(sql, [
      userId,
      timeslot.gym_id,
      timeSlotId,
      timeslot.startTime,
      timeslot.endTime,
      timeslot.date,
      status,
    ]);

    // Incrementează numărul de rezervări pentru intervalul de timp
    await incrementReservedCount(timeSlotId);
    await pool.query("COMMIT"); // Încheie tranzacția cu succes

    // Returnează ID-ul rezervării nou create
    return result.insertId;
  } catch (error) {
    await pool.query("ROLLBACK"); // Revocă tranzacția dacă apare o eroare
    throw error;
  }
};

// Funcție pentru obținerea tuturor rezervărilor
const getAllBookings = async () => {
  const sql = "SELECT * FROM bookings";
  const [rows] = await pool.query(sql);
  // Returnează toate rezervările
  return rows;
};

// Funcție pentru obținerea unei rezervări după ID
const getBookingById = async (bookingId) => {
  const sql = "SELECT * FROM bookings WHERE id = ?";
  const [rows] = await pool.query(sql, [bookingId]);
  // Returnează primul rezultat (dacă există)
  return rows[0];
};

// Funcție pentru actualizarea unei rezervări
const updateBooking = async (bookingId, updatedBooking) => {
  await pool.query("START TRANSACTION"); // Începe o tranzacție

  try {
    const {
      user_id: userId,
      gym_id: gymId,
      timeslots_id: timeSlotId,
      status,
    } = updatedBooking;

    // Validarea statusului
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      throw new Error("The provided status is not valid");
    }

    // Obținerea capacității sălii de sport și a numărului curent de rezervări pentru intervalul de timp
    const [timeslotData] = await pool.query(
      `SELECT ts.*, g.capacity, g.id as gym_id
      FROM timeslots ts
      JOIN gyms g ON ts.gym_id = g.id
      WHERE ts.id = ?`,
      [timeSlotId]
    );
    const timeslot = timeslotData[0];

    if (!timeslot) {
      throw new Error("The specified time slot does not exist.");
    }

    // Verificarea disponibilității intervalului de timp
    if (status === "confirmed" && timeslot.reservedCount >= timeslot.capacity) {
      throw new Error("The selected timeslot is fully booked.");
    }

    // Obținerea rezervării curente pentru a verifica statusul anterior
    const currentBooking = await getBookingById(bookingId);
    if (!currentBooking) {
      throw new Error("The booking does not exist.");
    }

    const sql =
      "UPDATE bookings SET user_id = ?, gym_id = ?, timeslots_id = ?, startTime = ?, endTime = ?, date = ?, status = ? WHERE id = ?";
    await pool.query(sql, [
      userId,
      gymId,
      timeSlotId,
      timeslot.startTime,
      timeslot.endTime,
      timeslot.date,
      status,
      bookingId,
    ]);

    // Dacă o rezervare în așteptare este confirmată, incrementăm contorul
    if (currentBooking.status === "pending" && status === "confirmed") {
      await incrementReservedCount(timeSlotId);
    }

    // Dacă o rezervare confirmată este anulată, decrementăm contorul
    if (currentBooking.status === "confirmed" && status === "cancelled") {
      await decrementReservedCount(timeSlotId);
    }

    // Dacă o rezervare în așteptare este anulată, decrementăm contorul
    if (currentBooking.status === "pending" && status === "cancelled") {
      await decrementReservedCount(timeSlotId);
    }

    await pool.query("COMMIT"); // Confirmă tranzacția
    // Returnează true dacă actualizarea a fost efectuată cu succes
    return true;
  } catch (error) {
    await pool.query("ROLLBACK"); // Revocă în caz de eroare
    throw error;
  }
};

// Obținerea rezervărilor care sunt "pending" și mai vechi de 5 minute
const getOldPendingBookings = async () => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const sql =
    "SELECT * FROM bookings WHERE status = 'pending' AND createdAt < ?";
  const [oldBookings] = await pool.query(sql, [fiveMinutesAgo]);
  // Returnează rezervările vechi în așteptare
  return oldBookings;
};

// Actualizarea statusului unei rezervări
const updateBookingStatus = async (bookingId, newStatus) => {
  const sql = "UPDATE bookings SET status = ? WHERE id = ?";
  const [result] = await pool.query(sql, [newStatus, bookingId]);
  // Returnează true dacă statusul a fost actualizat
  return result.changedRows > 0;
};

// Funcție pentru ștergerea unei rezervări
const deleteBooking = async (bookingId) => {
  await pool.query("START TRANSACTION"); // Începe o tranzacție

  try {
    const booking = await getBookingById(bookingId);
    if (!booking) {
      throw new Error("The booking does not exist..");
    }

    const timeslot = await getTimeSlotById(booking.timeslots_id);
    if (timeslot) {
      // Doar dacă rezervarea este confirmată ar trebui să decrementăm.
      if (booking.status === "confirmed") {
        await decrementReservedCount(timeslot.id);
      }
    }

    const sql = "DELETE FROM bookings WHERE id = ?";
    await pool.query(sql, [bookingId]);

    await pool.query("COMMIT"); // Confirmă tranzacția
    // Returnează true dacă ștergerea a fost efectuată cu succes
    return true;
  } catch (error) {
    await pool.query("ROLLBACK"); // Revocă în caz de eroare
    throw error;
  }
};

// Funcție pentru obținerea următoarei rezervări pentru un utilizator
const getNextBookingForUser = async (userId) => {
  const sql = `SELECT b.*, g.location 
    FROM bookings AS b
    JOIN gyms AS g ON b.gym_id = g.id
    WHERE b.user_id = ? AND b.status = 'confirmed' AND (b.date > CURDATE() OR (b.date = CURDATE() AND b.startTime > CURRENT_TIME()))
    ORDER BY b.date ASC, b.startTime ASC
    LIMIT 1`;
  const [rows] = await pool.query(sql, [userId]);
  // Returnează următoarea rezervare confirmată pentru utilizator
  return rows[0];
};

// Funcție pentru obținerea detaliilor unei rezervări după ID
const getDetailedBookingById = async (bookingId) => {
  const sql = `
  SELECT bookings.*, gyms.location, timeslots.startTime, timeslots.endTime
  FROM bookings
  JOIN gyms ON bookings.gym_id = gyms.id
  JOIN timeslots ON bookings.timeslots_id = timeslots.id
  WHERE bookings.id = ?`;
  const [rows] = await pool.query(sql, [bookingId]);
  // Returnează detaliile rezervării
  return rows[0];
};

// Verifică dacă utilizatorul are o rezervare activă
const hasActiveBooking = async (userId) => {
  const sql = `
  SELECT COUNT(*) as activeBookings
  FROM bookings 
  INNER JOIN timeslots ON bookings.timeslots_id = timeslots.id
  WHERE bookings.user_id = ? 
  AND (bookings.status = 'pending' OR bookings.status = 'confirmed')
  AND (timeslots.date > CURDATE() OR (timeslots.date = CURDATE() AND timeslots.endTime > CURTIME()))`;
  const [rows] = await pool.query(sql, [userId]);
  // Returnează true dacă utilizatorul are o rezervare activă
  return rows[0].activeBookings > 0;
};

// Anulează o rezervare după ID
const cancelBookingById = async (bookingId) => {
  const booking = await getBookingById(bookingId);
  if (!booking) throw new Error("Booking not found");
  if (booking.status !== "cancelled") {
    await decrementReservedCount(booking.timeslots_id);
  }

  await updateBookingStatus(bookingId, "cancelled");
  // Nu returnează nimic
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  getOldPendingBookings,
  updateBookingStatus,
  deleteBooking,
  getNextBookingForUser,
  getDetailedBookingById,
  hasActiveBooking,
  cancelBookingById,
};
