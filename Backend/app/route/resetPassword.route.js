const express = require("express");
const router = express.Router();
const PasswordReset = require("../controller/resetPassword.controller");
const request = require("../middeware/request.midderware");
router.route("/").post(PasswordReset.create);
router
  .route("/:id")
  .put([request.sanitizeDataMiddleware, PasswordReset.update]);
module.exports = router;
