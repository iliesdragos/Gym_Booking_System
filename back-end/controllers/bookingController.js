const Booking = require("../models/booking");
const TimeSlot = require("../models/timeSlot");

// Funcție pentru crearea unei noi rezervări
const createBooking = async (req, res) => {
  try {
    const { user_id, timeslots_id, status } = req.body;

    const newBookingData = {
      user_id,
      timeslots_id,
      status,
    };

    // Verifică dacă utilizatorul are deja o rezervare activă
    const existingActiveBooking = await Booking.hasActiveBooking(user_id);
    if (existingActiveBooking) {
      return res.status(400).json({
        message: "You already have an active booking.",
      });
    }

    // Creează rezervarea și returnează ID-ul acesteia
    const bookingId = await Booking.createBooking(newBookingData);

    // Returnează detaliile rezervării noi
    const newBooking = await Booking.getBookingById(bookingId);
    return res
      .status(201)
      .json({ message: "Booking created successfully!", booking: newBooking });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Funcție pentru obținerea tuturor rezervărilor
const getAllBookings = async (req, res) => {
  try {
    // Returnează toate rezervările
    const bookings = await Booking.getAllBookings();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Funcție pentru actualizarea unei rezervări
const updateBooking = async (req, res) => {
  try {
    // Extrage statusul dorit și ID-ul rezervării din cererea PUT
    const { status } = req.body;
    const bookingId = req.params.id;

    // Validarea statusului
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res
        .status(400)
        .json({ message: "The provided status is not valid." });
    }

    // Actualizează rezervarea folosind modelul
    const bookingUpdated = await Booking.updateBookingStatus(bookingId, status);
    if (bookingUpdated) {
      return res.status(200).json({ message: "Booking updated successfully!" });
    } else {
      return res.status(404).json({
        message: "The booking was not found or the status was not changed.",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Funcție pentru ștergerea unei rezervări
const deleteBooking = async (req, res) => {
  try {
    // Șterge rezervarea și returnează true dacă a avut succes
    const success = await Booking.deleteBooking(req.params.id);
    if (success) {
      return res.status(200).json({ message: "Booking deleted successfully!" });
    } else {
      return res.status(404).json({ message: "Deletion failed." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Funcție pentru anularea unei rezervări
const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    // Obține rezervarea după ID
    const booking = await Booking.getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "The booking was not found." });
    }

    // Verifică dacă rezervarea este deja anulată pentru a evita actualizările inutile
    if (booking.status === "cancelled") {
      return res
        .status(400)
        .json({ message: "The booking is already cancelled." });
    }

    // Actualizează statusul rezervării la 'cancelled'
    const success = await Booking.updateBookingStatus(bookingId, "cancelled");
    if (success) {
      // Dacă rezervarea era confirmată sau în așteptare, decrementează contorul pentru intervalul de timp
      if (booking.status === "confirmed" || booking.status == "pending") {
        await TimeSlot.decrementReservedCount(booking.timeslots_id);
      }
      return res
        .status(200)
        .json({ message: "The booking was cancelled successfully!" });
    } else {
      return res.status(404).json({
        message: "The booking was not found or the status was not changed.",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Funcție pentru obținerea următoarei rezervări pentru un utilizator
const getNextBooking = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Returnează următoarea rezervare confirmată pentru utilizator
    const nextBooking = await Booking.getNextBookingForUser(userId);
    if (nextBooking) {
      res.status(200).json(nextBooking);
    } else {
      return res.status(404).json({ message: "No future booking exists." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Funcție pentru obținerea detaliilor unei rezervări după ID
const getDetailedBookingById = async (req, res) => {
  try {
    // Returnează detaliile rezervării
    const detailedBooking = await Booking.getDetailedBookingById(req.params.id);
    if (detailedBooking) {
      res.status(200).json(detailedBooking);
    } else {
      return res.status(404).json({ message: "The booking was not found." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  updateBooking,
  deleteBooking,
  cancelBooking,
  getNextBooking,
  getDetailedBookingById,
};
