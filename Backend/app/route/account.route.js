const express = require("express");
const accounts = require("../controller/account.controller");

const router = express.Router();
router.route("/").post(accounts.create);
module.exports = router;
