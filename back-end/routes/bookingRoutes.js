const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.post("/", bookingController.createBooking);
router.get("/", bookingController.getAllBookings);
router.put("/:id", bookingController.updateBooking);
router.delete("/:id", bookingController.deleteBooking);
router.post("/cancel/:id", bookingController.cancelBooking);
router.get("/detailed/:id", bookingController.getDetailedBookingById);

module.exports = router;
