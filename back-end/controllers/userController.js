const User = require("../models/user");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const crypto = require("crypto");

const registerUser = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    // Verifică dacă un utilizator cu acest email există deja
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const userId = await User.createUser({ email, name, password });
    res.status(201).json({ message: "User successfully created!", userId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Găsește utilizatorul după email
    const user = await User.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }
    // Verifică parola
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // Initializează sesiunea pentru utilizator
      req.session.userId = user.id;
      req.session.userRole = user.role;

      // Returnează rolul utilizatorului ca parte din răspuns
      return res.status(200).json({
        message: "Login successful.",
        user: {
          id: user.id,
          role: user.role,
        },
      });
    } else {
      return res.status(401).json({ message: "Incorrect email or password." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout error." });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Successfully logged out." });
  });
};

const getProfile = async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
t;
const updateProfile = async (req, res) => {
  const { email, name, newPassword } = req.body;
  const userId = req.session.userId;

  try {
    let updateFields = {};
    if (email) {
      //Verifică dacă noua adresă de email este deja utilizată de alt utilizator
      const existingUser = await User.findUserByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({
          message: "Email address is already used by another account.",
        });
      }
      updateFields.email = email;
    }
    if (name) {
      updateFields.name = name;
    }
    if (newPassword) {
      updateFields.password = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(updateFields).length > 0) {
      const success = await User.updateUser(userId, updateFields);
      if (success) {
        res.status(200).json({ message: "Profile successfully updated." });
      } else {
        res.status(400).json({ message: "Profile update failed." });
      }
    } else {
      res.status(400).json({ message: "No data provided for update." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listAllUsers = async (req, res) => {
  try {
    const users = await User.findAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, name, password, role } = req.body;

  try {
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;
    const updateFields = {
      email,
      name,
      password: hashedPassword,
      role,
    };

    // Filtrează câmpurile nedefinite înainte de actualizare
    const fieldsToApply = Object.fromEntries(
      Object.entries(updateFields).filter(([_, v]) => v != null)
    );

    const success = await User.updateUser(id, fieldsToApply);

    if (success) {
      res.status(200).json({ message: "User successfully updated." });
    } else {
      res.status(400).json({ message: "User update failed." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const success = await User.deleteUser(id);

    if (success) {
      res.status(200).json({ message: "User successfully deleted." });
    } else {
      res.status(400).json({ message: "User deletion failed." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Funcție pentru generarea unui token de resetare a parolei
const generateResetToken = () => {
  // Generează un token alfanumeric aleatoriu de 20 de caractere
  return crypto.randomBytes(20).toString("hex");
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findUserByEmail(email);
  if (!user) {
    return res.status(400).send("User does not exist.");
  }

  // Generează un token de resetare a parolei și setează termenul de expirare
  const resetToken = generateResetToken();
  await User.setResetPasswordToken(email, resetToken, Date.now() + 3600000); // 1 oră până la expirare

  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

  const msg = {
    to: email,
    from: "ilies.dragos2002@gmail.com",
    subject: "Password reset",
    text: `Please use the following link to reset your password: ${resetUrl}`,
    html: `<strong>Please use the following link to reset your password:</strong> <a href="${resetUrl}">Reset Password</a>`,
  };

  sgMail
    .send(msg)
    .then(() => res.status(200).send("The password reset email has been sent."))
    .catch((error) => {
      console.error("Error sending email:", error);
      res.status(500).send("The password reset email could not be sent.");
    });
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    // Verifică token-ul și găsește utilizatorul
    const user = await User.getResetPasswordToken(token);
    if (!user) {
      return res.status(400).send("Invalid or expired token.");
    }

    const success = await User.resetPassword(user.id, password);
    if (success) {
      res.send("Password has been successfully reset.");
    } else {
      res.status(500).send("Password reset failed.");
    }
  } catch (error) {
    res.status(500).send("Server error.");
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  listAllUsers,
  getProfile,
  updateProfile,
  updateUser,
  deleteUser,
  generateResetToken,
  forgotPassword,
  resetPassword,
};
