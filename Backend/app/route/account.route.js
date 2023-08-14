const express = require("express");
const accounts = require("../controller/account.controller");

const router = express.Router();
router.route("/").get(accounts.findAll).post(accounts.create);
router
  .route("/:id")
  .get(accounts.findOne)
  .put(accounts.updated)
  .delete(accounts.delete);
module.exports = router;
