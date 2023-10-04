const express = require("express");
const router = express.Router();
const spending = require("../controller/spending.controller");
const authorization = require("../middeware/authorization.middeware");

router
  .route("/")
  .post(
    authorization.authentication,
    authorization.authorization("thêm phát sinh"),
    spending.create
  )
  .get(
    authorization.authentication,
    authorization.authorization("xem danh sách phát sinh"),
    spending.findAll
  )
  .delete(
    authorization.authentication,
    authorization.authorization("xóa phát sinh"),
    spending.deleteAll
  );
router
  .route("/:id")
  .put(
    authorization.authentication,
    authorization.authorization("chỉnh sửa phát sinh"),
    spending.updated
  )
  .get(
    authorization.authentication,
    authorization.authorization("xem danh sách phát sinh"),
    spending.findOne
  )
  .delete(
    authorization.authentication,
    authorization.authorization("xóa phát sinh"),
    spending.delete
  );
module.exports = router;
