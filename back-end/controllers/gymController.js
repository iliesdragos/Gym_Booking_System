const Gym = require("../models/gym");

// Funcție pentru crearea unei noi săli de fitness
const createGym = async (req, res) => {
  try {
    // Creează o nouă sală de fitness și returnează ID-ul acesteia
    const gymId = await Gym.createGym(req.body);
    res
      .status(201)
      .json({ message: "The fitness gym was successfully created!", gymId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Funcție pentru obținerea tuturor sălilor de fitness
const getAllGyms = async (req, res) => {
  try {
    // Returnează toate sălile de fitness
    const gyms = await Gym.getAllGyms();
    res.status(200).json(gyms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Funcție pentru actualizarea unei săli de fitness
const updateGym = async (req, res) => {
  try {
    // Actualizează sala de fitness și returnează true dacă a avut succes
    const success = await Gym.updateGym(req.params.id, req.body);
    if (success) {
      res
        .status(200)
        .json({ message: "The fitness gym was successfully updated!" });
    } else {
      res.status(404).json({ message: "The update failed." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Funcție pentru ștergerea unei săli de fitness
const deleteGym = async (req, res) => {
  try {
    // Șterge sala de fitness și returnează true dacă a avut succes
    const success = await Gym.deleteGym(req.params.id);
    if (success) {
      res
        .status(200)
        .json({ message: "The fitness gym was successfully deleted!" });
    } else {
      res.status(404).json({ message: "The deletion failed." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createGym, getAllGyms, updateGym, deleteGym };
