const express = require("express");
const UtilityReadings = require("../controller/utilityreadings.controler");
const authorization = require("../middeware/authorization.middeware");
const router = express.Router();
router
  .route("/")
  .get(
    authorization.authentication,
    authorization.authorization("xem tiêu thụ điện nước"),
    UtilityReadings.findAll
  )
  .post([
    authorization.authentication,
    authorization.authorization("thêm tiêu thụ điện nước"),
    UtilityReadings.create,
  ]);
router
  .route("/:id")
  .get(
    authorization.authentication,
    authorization.authorization("xem tiêu thụ điện nước"),
    UtilityReadings.findOne
  )
  .put(
    authorization.authentication,
    authorization.authorization("chỉnh sửa điện nước"),
    UtilityReadings.updated
  )
  .delete(
    authorization.authentication,
    authorization.authorization("xóa tiêu thụ điện nước"),
    UtilityReadings.delete
  );
module.exports = router;
