const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const bookingController = require("../controllers/bookingController");

router.get("/listAllUsers", userController.listAllUsers);
router.put("/update/:id", userController.updateUser);
router.delete("/delete/:id", userController.deleteUser);
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/logout", userController.logoutUser);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.get("/profile", userController.getProfile);
router.post("/updatedProfile", userController.updateProfile);
router.get("/nextBooking/:userId", bookingController.getNextBooking);

module.exports = router;
