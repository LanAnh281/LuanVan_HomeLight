const express = require("express");
const router = express.Router();
const receipt = require("../controller/receipt.controller");
router
  .route("/")
  .post(receipt.create)
  .get(receipt.findAll)
  .delete(receipt.deleteAll);
router
  .route("/:id")
  .put(receipt.updated)
  .get(receipt.findOne)
  .delete(receipt.delete);
module.exports = router;
