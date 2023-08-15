const express = require("express");
const position = require("../controller/position.controller");

const router = express.Router();
router.route("/").get(position.findAll).post(position.create);
router
  .route("/:id")
  .get(position.findOne)
  .put(position.updated)
  .delete(position.delete);
module.exports = router;
