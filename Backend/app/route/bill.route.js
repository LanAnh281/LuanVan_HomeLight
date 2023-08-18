const express = require("express");
const router = express.Router();
const bill = require("../controller/bill.controller");
router.route("/").post(bill.create).get(bill.findAll).delete(bill.deleteAll);
router.route("/:id").put(bill.updated).get(bill.findOne).delete(bill.delete);
module.exports = router;
