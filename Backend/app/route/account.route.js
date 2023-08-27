const express = require("express");
const accounts = require("../controller/account.controller");
const authorization = require("../middeware/authorization.middeware");
const router = express.Router();
router
  .route("/")
  .get(accounts.findAll)
  .post(accounts.create)
  .put([authorization.authorization, accounts.updated]);
router.route("/:id").get(accounts.findOne).delete(accounts.delete);
module.exports = router;
