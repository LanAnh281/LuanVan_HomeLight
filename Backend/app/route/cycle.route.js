const express = require("express");
const router = express.Router();
const cycle = require("../controller/cycle.controller");
router.route("/").post(cycle.create).get(cycle.findAll).delete(cycle.deleteAll);
router.route("/:id").put(cycle.updated).get(cycle.findOne).delete(cycle.delete);
module.exports = router;
