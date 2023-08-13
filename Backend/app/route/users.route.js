const express = require("express");
const router = express.Router();
const customer = require("../controller/users.controller");

router.route("/").post(customer.create);
module.exports = router;
