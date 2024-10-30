const express = require("express");
const router = express.Router();
const timeSlotController = require("../controllers/timeSlotController");

router.post("/", timeSlotController.createTimeSlot);
router.get("/", timeSlotController.getAllTimeSlots);
router.get("/available/:gymId", timeSlotController.getAvailableTimeSlots);
router.put("/:id", timeSlotController.updateTimeSlot);
router.delete("/:id", timeSlotController.deleteTimeSlot);

module.exports = router;
