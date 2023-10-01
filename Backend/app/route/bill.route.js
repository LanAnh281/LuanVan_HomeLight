const express = require("express");
const router = express.Router();
const bill = require("../controller/bill.controller");
const authorization = require("../middeware/authorization.middeware");
//  authorization.authentication,
// authorization.authorization("xem danh sách dịch vụ"),

router.route("/").post(bill.create).get(bill.findAll).delete(bill.deleteAll);
router.route("/:id").put(bill.updated).get(bill.findOne).delete(bill.delete);
module.exports = router;
