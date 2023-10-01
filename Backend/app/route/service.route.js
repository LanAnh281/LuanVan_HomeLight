const express = require("express");
const service = require("../controller/service.controller");
const authorization = require("../middeware/authorization.middeware");
const router = express.Router();
router
  .route("/")
  .get(
    authorization.authentication,
    authorization.authorization("xem danh sách dịch vụ"),
    service.findAll
  )
  .post([
    authorization.authentication,
    authorization.authorization("thêm dịch vụ"),
    service.create,
  ]);
router
  .route("/:id")
  .get(
    authorization.authentication,
    authorization.authorization("xem danh sách dịch vụ"),
    service.findOne
  )
  .put(
    authorization.authentication,
    authorization.authorization("chỉnh sửa dịch vụ"),
    service.updated
  )
  .delete(service.delete);
router
  .route("/getAll/user")
  .get(
    authorization.authentication,
    authorization.authorization("xem danh sách dịch vụ"),
    service.findAllUser
  );
module.exports = router;
