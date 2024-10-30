const pool = require("../lib/database");

// Funcție pentru crearea unui nou interval de timp
const createTimeSlot = async (timeSlot) => {
  const { gym_id: gymId, startTime, endTime, date, reservedCount } = timeSlot;
  const sql =
    "INSERT INTO timeslots (gym_id, startTime, endTime, date, reservedCount) VALUES (?, ?, ?, ?, ?)";
  try {
    const [result] = await pool.query(sql, [
      gymId,
      startTime,
      endTime,
      date,
      reservedCount,
    ]);
    // Returnează ID-ul intervalului de timp nou creat
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

// Funcție pentru obținerea tuturor intervalelor de timp
const getAllTimeSlots = async () => {
  const sql = "SELECT * FROM timeslots";
  try {
    const [rows] = await pool.query(sql);
    // Returnează toate intervalele de timp
    return rows;
  } catch (error) {
    throw error;
  }
};

// Funcție pentru obținerea unui interval de timp după ID
const getTimeSlotById = async (timeSlotId) => {
  const sql = "SELECT * FROM timeslots WHERE id = ?";
  try {
    const [rows] = await pool.query(sql, [timeSlotId]);
    // Returnează primul rezultat (dacă există)
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// Funcție pentru actualizarea unui interval de timp
const updateTimeSlot = async (timeSlotId, updatedTimeSlot) => {
  const {
    gym_id: gymId,
    startTime,
    endTime,
    date,
    reservedCount,
  } = updatedTimeSlot;

  // Construiește părțile interogării SQL dinamic, pe baza câmpurilor actualizate
  const sqlParts = [];
  const sqlValues = [];
  if (gymId !== undefined) {
    sqlParts.push("gym_id = ?");
    sqlValues.push(gymId);
  }
  if (startTime !== undefined) {
    sqlParts.push("startTime = ?");
    sqlValues.push(startTime);
  }
  if (endTime !== undefined) {
    sqlParts.push("endTime = ?");
    sqlValues.push(endTime);
  }
  if (date !== undefined) {
    sqlParts.push("date = ?");
    sqlValues.push(date);
  }
  if (reservedCount !== undefined) {
    sqlParts.push("reservedCount = ?");
    sqlValues.push(reservedCount);
  }

  // Dacă există câmpuri de actualizat, construiește și execută interogarea SQL
  if (sqlParts.length > 0) {
    const sql = `UPDATE timeslots SET ${sqlParts.join(", ")} WHERE id = ?`;
    sqlValues.push(timeSlotId);
    try {
      await pool.query(sql, sqlValues);
      return true;
    } catch (error) {
      throw error;
    }
  } else {
    // Aruncă o eroare dacă nu sunt furnizate date pentru actualizare
    throw new Error("No data provided for update.");
  }
};

// Funcție pentru obținerea intervalelor de timp disponibile pentru o sală de sport într-o anumită dată
const getAvailableTimeSlotsForGym = async (gymId, date) => {
  const sql = `
    SELECT ts.id, ts.startTime, ts.endTime, ts.date, 
           IFNULL(b.reservedCount, 0) as reservedCount, g.capacity
    FROM timeslots ts
    LEFT JOIN (
      SELECT timeslots_id, COUNT(*) as reservedCount
      FROM bookings
      WHERE date = ?
      GROUP BY timeslots_id
    ) b ON ts.id = b.timeslots_id
    JOIN gyms g ON ts.gym_id = g.id
    WHERE ts.gym_id = ? AND ts.date = ? AND g.capacity > IFNULL(b.reservedCount, 0)
  `;
  try {
    const [rows] = await pool.query(sql, [date, gymId, date]);
    // Returnează intervalele de timp disponibile
    return rows;
  } catch (error) {
    throw error;
  }
};

// Funcție pentru ștergerea unui interval de timp
const deleteTimeSlot = async (timeSlotId) => {
  const sql = "DELETE FROM timeslots WHERE id = ?";
  try {
    await pool.query(sql, [timeSlotId]);
    // Returnează true dacă ștergerea a fost efectuată
    return true;
  } catch (error) {
    throw error;
  }
};

// Funcție pentru incrementarea numărului de rezervări pentru un interval de timp
const incrementReservedCount = async (timeSlotId) => {
  const sql = `UPDATE timeslots SET reservedCount = reservedCount + 1 WHERE id = ?`;
  try {
    const [result] = await pool.query(sql, [timeSlotId]);
    // Returnează true dacă actualizarea a fost efectuată
    return result.affectedRows === 1;
  } catch (error) {
    throw error;
  }
};

// Funcție pentru decrementarea numărului de rezervări pentru un interval de timp
const decrementReservedCount = async (timeSlotId) => {
  const sql = `UPDATE timeslots SET reservedCount = reservedCount - 1 WHERE id = ? AND reservedCount > 0`;
  try {
    const [result] = await pool.query(sql, [timeSlotId]);
    // Returnează true dacă actualizarea a fost efectuată
    return result.affectedRows === 1;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createTimeSlot,
  getAllTimeSlots,
  getTimeSlotById,
  updateTimeSlot,
  deleteTimeSlot,
  getAvailableTimeSlotsForGym,
  incrementReservedCount,
  decrementReservedCount,
};
