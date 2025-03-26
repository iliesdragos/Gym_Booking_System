const Gym = require("../models/gym");

const createGym = async (req, res) => {
  try {
    const gymId = await Gym.createGym(req.body);
    res
      .status(201)
      .json({ message: "The fitness gym was successfully created!", gymId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllGyms = async (req, res) => {
  try {
    const gyms = await Gym.getAllGyms();
    res.status(200).json(gyms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateGym = async (req, res) => {
  try {
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

const deleteGym = async (req, res) => {
  try {
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
