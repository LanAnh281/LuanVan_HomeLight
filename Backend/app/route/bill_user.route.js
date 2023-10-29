const express = require("express");
const bill_user = require("../controller/bill_user.controller");
const authorization = require("../middeware/authorization.middeware");
const router = express.Router();
router
  .route("/")
  .get(
    authorization.authentication,
    authorization.authorization("xem danh sách dịch vụ"),
    bill_user.findAll
  );

router
  .route("/:id")
  .get(
    authorization.authentication,
    authorization.authorization("xem danh sách dịch vụ"),
    bill_user.findOne
  );

router
  .route("/getAll/user")
  .get(
    authorization.authentication,
    authorization.authorization("xem danh sách dịch vụ"),
    bill_user.findAllUser
  );
module.exports = router;
