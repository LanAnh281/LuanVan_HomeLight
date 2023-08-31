const express = require("express");
const accounts = require("../controller/account.controller");
const authorization = require("../middeware/authorization.middeware");
const request = require("../middeware/request.midderware");
const router = express.Router();
router
  .route("/")
  .get(accounts.findAll)
  .post(accounts.create)
  .put([
    request.sanitizeDataMiddleware,
    authorization.authentication,
    authorization.authorization("update-password"),
    accounts.updated,
  ]);
router.route("/:id").get(accounts.findOne).delete(accounts.delete);
module.exports = router;
