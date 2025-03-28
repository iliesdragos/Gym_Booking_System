const bcrypt = require("bcrypt");
const pool = require("../lib/database");

const createUser = async ({ email, name, password }) => {
  try {
    // Hash-uirea parolei pentru a o proteja în baza de date
    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultRole = 2; // 2 reprezintă un rol implicit pentru utilizatorii nou înregistrați
    const sql =
      "INSERT INTO users (email, name, password, role) VALUES (?, ?, ?, ?)";
    const [result] = await pool.query(sql, [
      email,
      name,
      hashedPassword,
      defaultRole,
    ]);
    return { id: result.insertId, email, name, role: defaultRole };
  } catch (error) {
    throw error;
  }
};

const findUserById = async (userId) => {
  try {
    const sql = "SELECT * FROM users WHERE id = ?";
    const [rows] = await pool.query(sql, [userId]);
    if (rows.length > 0) {
      return rows[0];
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

const findUserByEmail = async (email) => {
  try {
    const sql = "SELECT * FROM users WHERE email = ? LIMIT 1";
    const [rows] = await pool.query(sql, [email]);
    if (rows.length > 0) {
      return rows[0];
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

const findAllUsers = async () => {
  try {
    const sql = "SELECT * FROM users";
    const [rows] = await pool.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (userId, updateFields) => {
  // Construirea dinamică a părții SET din interogarea SQL pe baza câmpurilor furnizate
  // Acest lucru permite actualizarea doar a câmpurilor specifice fără a afecta restul datelor
  const sqlParts = [];
  const sqlValues = [];

  if (updateFields.hasOwnProperty("email")) {
    sqlParts.push("email = ?");
    sqlValues.push(updateFields.email);
  }
  if (updateFields.hasOwnProperty("name")) {
    sqlParts.push("name = ?");
    sqlValues.push(updateFields.name);
  }
  if (updateFields.hasOwnProperty("password")) {
    // Verificarea dacă parola trebuie actualizată și hash-uirea acesteia
    const hashedPassword = await bcrypt.hash(updateFields.password, 10);
    sqlParts.push("password = ?");
    sqlValues.push(hashedPassword);
  }
  if (updateFields.hasOwnProperty("role")) {
    sqlParts.push("role = ?");
    sqlValues.push(updateFields.role);
  }

  if (sqlParts.length === 0) {
    throw new Error("No data provided for update.");
  }
  const sql = `UPDATE users SET ${sqlParts.join(", ")} WHERE id = ?`;
  sqlValues.push(userId); // Adăugarea ID-ului utilizatorului la sfârșitul listei de valori pentru interogare
  try {
    const [result] = await pool.query(sql, sqlValues);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    const sql = "DELETE FROM users WHERE id = ?";
    const [result] = await pool.query(sql, [userId]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

// Funcție pentru setarea token-ului de resetare a parolei
const setResetPasswordToken = async (email, token) => {
  const expires = new Date(Date.now() + 3600000); // Token-ul expiră în 1 oră pentru securitate sporită
  try {
    const sql =
      "UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?";
    const [result] = await pool.query(sql, [token, expires, email]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

// Funcție pentru obținerea token-ului de resetare a parolei
const getResetPasswordToken = async (token) => {
  try {
    const sql =
      "SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?";
    const [rows] = await pool.query(sql, [token, Date.now()]);
    if (rows.length > 0) {
      return rows[0];
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

// Funcție pentru resetarea parolei
const resetPassword = async (userId, newPassword) => {
  try {
    // Hash-uirea noii parole înainte de a o salva în baza de date
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const sql =
      "UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?";
    const [result] = await pool.query(sql, [hashedPassword, userId]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  findUserById,
  findUserByEmail,
  findAllUsers,
  updateUser,
  deleteUser,
  setResetPasswordToken,
  getResetPasswordToken,
  resetPassword,
};
