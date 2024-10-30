const cron = require("node-cron");
const bookingModel = require("../models/booking");

// Funcție pentru a porni task-ul de curățare a rezervărilor
const startBookingCleanupTask = () => {
  // Rulează acest task la fiecare 5 minute
  cron.schedule("*/5 * * * *", async () => {
    console.log("Running booking cleanup task.");
    try {
      // Obține rezervările vechi care sunt încă în stare 'pending'
      const oldPendingBookings = await bookingModel.getOldPendingBookings();

      // Iterează prin rezervările vechi și le anulează
      for (const booking of oldPendingBookings) {
        await bookingModel.cancelBookingById(booking.id);
      }
    } catch (error) {
      console.error("Error during booking cleanup: ", error);
    }
  });
};

// Exportă funcția pentru a fi utilizată în alte module
module.exports = {
  startBookingCleanupTask,
};
