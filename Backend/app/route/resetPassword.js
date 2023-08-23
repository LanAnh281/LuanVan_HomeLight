const express = require("express");
const router = express.Router();
const PasswordReset = require("../controller/resetPassword");

router.route("/").post(PasswordReset.create);
module.exports = router;
