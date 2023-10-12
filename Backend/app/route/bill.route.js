const express = require("express");
const router = express.Router();
const bill = require("../controller/bill.controller");
const authorization = require("../middeware/authorization.middeware");

router
  .route("/")
  .post(
    authorization.authentication,
    authorization.authorization("thêm hóa đơn"),
    bill.create
  )
  .get(
    authorization.authentication,
    authorization.authorization("xem hóa đơn"),
    bill.findAll
  )
  .delete(bill.deleteAll);
router
  .route("/:id")
  .put(
    authorization.authentication,
    authorization.authorization("chỉnh sửa hóa đơn"),
    bill.updated
  )
  .get(
    authorization.authentication,
    authorization.authorization("xem hóa đơn"),
    bill.findOne
  )
  .delete(
    authorization.authentication,
    authorization.authorization("xóa hóa đơn"),
    bill.delete
  );
router
  .route("/getAll/Customer")
  .get(
    authorization.authentication,
    authorization.authorization("xem hóa đơn"),
    bill.findAllCustomer
  );
module.exports = router;
