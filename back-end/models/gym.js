const pool = require("../lib/database");

const createGym = async (gym) => {
  const { location, capacity, description } = gym;
  const sql =
    "INSERT INTO gyms (location, capacity, description) VALUES (?, ?, ?)";
  try {
    const [result] = await pool.query(sql, [location, capacity, description]);
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

const getAllGyms = async () => {
  const sql = "SELECT * FROM gyms";
  try {
    const [rows] = await pool.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

const getGymById = async (gymId) => {
  const sql = "SELECT * FROM gyms WHERE id = ?";
  try {
    const [rows] = await pool.query(sql, [gymId]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

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
      return true;
    } catch (error) {
      throw error;
    }
  } else {
    throw new Error("No data provided for update.");
  }
};

const deleteGym = async (gymId) => {
  const sql = "DELETE FROM gyms WHERE id = ?";
  try {
    await pool.query(sql, [gymId]);
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = { createGym, getAllGyms, getGymById, updateGym, deleteGym };
