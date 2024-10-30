const pool = require("../lib/database");

// Funcție pentru crearea unei noi săli de sport
const createGym = async (gym) => {
  const { location, capacity, description } = gym;
  const sql =
    "INSERT INTO gyms (location, capacity, description) VALUES (?, ?, ?)";
  try {
    const [result] = await pool.query(sql, [location, capacity, description]);
    // Returnează ID-ul sălii de sport nou create
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

// Funcție pentru obținerea tuturor sălilor de sport
const getAllGyms = async () => {
  const sql = "SELECT * FROM gyms";
  try {
    const [rows] = await pool.query(sql);
    // Returnează toate sălile de sport
    return rows;
  } catch (error) {
    throw error;
  }
};

// Funcție pentru obținerea unei săli de sport după ID
const getGymById = async (gymId) => {
  const sql = "SELECT * FROM gyms WHERE id = ?";
  try {
    const [rows] = await pool.query(sql, [gymId]);
    // Returnează primul rezultat (dacă există)
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// Funcție pentru actualizarea unei săli de sport
const updateGym = async (gymId, updatedGym) => {
  const { location, capacity, description } = updatedGym;

  // Construiește părțile interogării SQL dinamic, pe baza câmpurilor actualizate
  const sqlParts = [];
  const sqlValues = [];

  if (location !== undefined) {
    sqlParts.push("location = ?");
    sqlValues.push(location);
  }
  if (capacity !== undefined) {
    sqlParts.push("capacity = ?");
    sqlValues.push(capacity);
  }
  if (description !== undefined) {
    sqlParts.push("description = ?");
    sqlValues.push(description);
  }

  // Dacă există câmpuri de actualizat, construiește și execută interogarea SQL
  if (sqlParts.length > 0) {
    const sql = `UPDATE gyms SET ${sqlParts.join(", ")} WHERE id = ?`;
    sqlValues.push(gymId);

    try {
      await pool.query(sql, sqlValues);
      // Returnează true dacă actualizarea a fost efectuată
      return true;
    } catch (error) {
      throw error;
    }
  } else {
    // Aruncă o eroare dacă nu sunt furnizate date pentru actualizare
    throw new Error("No data provided for update.");
  }
};

// Funcție pentru ștergerea unei săli de sport
const deleteGym = async (gymId) => {
  const sql = "DELETE FROM gyms WHERE id = ?";
  try {
    await pool.query(sql, [gymId]);
    // Returnează true dacă ștergerea a fost efectuată
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = { createGym, getAllGyms, getGymById, updateGym, deleteGym };
