const express = require("express");
const accounts = require("../controller/account.controller");
const authorization = require("../middeware/authorization.middeware");
const request = require("../middeware/request.midderware");
const router = express.Router();
router
  .route("/")
  .get(
    authorization.authentication,
    authorization.authorization("xem danh sách tài khoản"),
    accounts.findAll
  )
  .post(
    request.sanitizeDataMiddleware,
    authorization.authentication,
    authorization.authorization("thêm tài khoản"),
    accounts.create
  )
  .put([
    request.sanitizeDataMiddleware,
    authorization.authentication,
    authorization.authorization("thay đổi mật khẩu"),
    accounts.updated,
  ]);
router
  .route("/:id")
  // .get(accounts.findOne)
  // .delete(accounts.delete)
  .put(
    authorization.authentication,
    authorization.authorization("khóa/mở tài khoản"),
    accounts.updatedActive
  );
module.exports = router;
