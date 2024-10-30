const TimeSlot = require("../models/timeSlot");

// Funcție pentru crearea unui nou interval de timp
const createTimeSlot = async (req, res) => {
  try {
    // Creează un nou interval de timp și returnează ID-ul acestuia
    const timeSlotId = await TimeSlot.createTimeSlot(req.body);
    res
      .status(201)
      .json({ message: "Time slot successfully created!", timeSlotId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Funcție pentru obținerea tuturor intervalelor de timp
const getAllTimeSlots = async (req, res) => {
  try {
    // Returnează toate intervalele de timp
    const timeSlots = await TimeSlot.getAllTimeSlots();
    res.status(200).json(timeSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Funcție pentru obținerea intervalelor de timp disponibile pentru o sală de sport într-o anumită dată
const getAvailableTimeSlots = async (req, res) => {
  try {
    const gymId = req.params.gymId;
    const date = req.query.date;
    // Returnează intervalele de timp disponibile pentru sala de sport specificată și data specificată
    const availableTimeSlots = await TimeSlot.getAvailableTimeSlotsForGym(
      gymId,
      date
    );
    res.status(200).json(availableTimeSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Funcție pentru actualizarea unui interval de timp
const updateTimeSlot = async (req, res) => {
  try {
    // Actualizează intervalul de timp și returnează true dacă a avut succes
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

// Funcție pentru ștergerea unui interval de timp
const deleteTimeSlot = async (req, res) => {
  try {
    // Șterge intervalul de timp și returnează true dacă a avut succes
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
