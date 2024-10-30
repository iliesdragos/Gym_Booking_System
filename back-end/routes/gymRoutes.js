const express = require("express");
const router = express.Router();
const gymController = require("../controllers/gymController");

router.post("/", gymController.createGym);
router.get("/", gymController.getAllGyms);
router.put("/:id", gymController.updateGym);
router.delete("/:id", gymController.deleteGym);

module.exports = router;
