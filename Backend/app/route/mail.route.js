const express = require("express");
const router = express.Router();
const mail = require("../controller/mail.controller");

router.route("/").post(mail.sendMail);

module.exports = router;
