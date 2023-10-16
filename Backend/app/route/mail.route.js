const express = require("express");
const router = express.Router();
const mail = require("../controller/mail.controller");
const authorization = require("../middeware/authorization.middeware");

router.route("/").post(
  // authorization.authentication,
  // authorization.authorization("soạn thư"),
  mail.sendMail
);

module.exports = router;
