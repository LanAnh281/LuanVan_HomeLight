const express = require("express");
const report = require("../controller/report.controller");
const authorization = require("../middeware/authorization.middeware");
const router = express.Router();
router.route("/").get(
  // authorization.authentication,
  // authorization.authorization("xem danh sách dịch vụ"),
  report.profitSuperAdmin
);

module.exports = router;
