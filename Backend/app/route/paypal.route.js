const express = require("express");
const router = express.Router();
const paypal = require("../controller/paypal.controller");
const authorization = require("../middeware/authorization.middeware");

router
  .route("/")
  .get(paypal.hien)
  .post(
    authorization.authentication,
    authorization.authorization("thanh toán"),
    paypal.taopaypal
  );

router.route("/success").get(paypal.thanhcong);
router.route("/cancel").get(paypal.thatbai);

module.exports = router;
