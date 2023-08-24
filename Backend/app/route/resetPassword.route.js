const express = require("express");
const router = express.Router();
const PasswordReset = require("../controller/resetPassword.controller");

router.route("/").post(PasswordReset.create);
router.route("/:id").put(PasswordReset.update);
module.exports = router;
