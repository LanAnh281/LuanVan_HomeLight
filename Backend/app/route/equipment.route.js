const express = require("express");
const equipment = require("../controller/equipment.controller");

const router = express.Router();
router.route("/").get(equipment.findAll).post(equipment.create);
router
  .route("/:id")
  .get(equipment.findOne)
  .put(equipment.updated)
  .delete(equipment.delete);
module.exports = router;
