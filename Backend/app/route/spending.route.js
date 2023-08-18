const express = require("express");
const router = express.Router();
const spending = require("../controller/spending.controller");
router
  .route("/")
  .post(spending.create)
  .get(spending.findAll)
  .delete(spending.deleteAll);
router
  .route("/:id")
  .put(spending.updated)
  .get(spending.findOne)
  .delete(spending.delete);
module.exports = router;
