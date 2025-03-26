const TimeSlot = require("../models/timeSlot");

const createTimeSlot = async (req, res) => {
  try {
    const timeSlotId = await TimeSlot.createTimeSlot(req.body);
    res
      .status(201)
      .json({ message: "Time slot successfully created!", timeSlotId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTimeSlots = async (req, res) => {
  try {
    const timeSlots = await TimeSlot.getAllTimeSlots();
    res.status(200).json(timeSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAvailableTimeSlots = async (req, res) => {
  try {
    const gymId = req.params.gymId;
    const date = req.query.date;
    const availableTimeSlots = await TimeSlot.getAvailableTimeSlotsForGym(
      gymId,
      date
    );
    res.status(200).json(availableTimeSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTimeSlot = async (req, res) => {
  try {
    const success = await TimeSlot.updateTimeSlot(req.params.id, req.body);
    if (success) {
      res.status(200).json({ message: "Time slot successfully updated!" });
    } else {
      res.status(404).json({ message: "The update failed." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTimeSlot = async (req, res) => {
  try {
    const success = await TimeSlot.deleteTimeSlot(req.params.id);
    if (success) {
      res.status(200).json({ message: "Time slot successfully deleted!" });
    } else {
      res.status(404).json({ message: "The deletion failed." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTimeSlot,
  getAllTimeSlots,
  getAvailableTimeSlots,
  updateTimeSlot,
  deleteTimeSlot,
};
