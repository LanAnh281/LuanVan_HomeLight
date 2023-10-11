const express = require("express");
const router = express.Router();
const notification = require("../controller/notification.controller");
const authorization = require("../middeware/authorization.middeware");

router
  .route("/")
  .post(
    authorization.authentication,
    authorization.authorization("thêm thông báo"),
    notification.create
  )
  .get(notification.findAll)
  .delete(notification.deleteAll);
router
  .route("/:id")
  .put(notification.updated)
  .get(notification.findOne)
  .delete(notification.delete);

router
  .route("/getAll/user")
  .get(
    authorization.authentication,
    authorization.authorization("xem thông báo"),
    notification.findAllUser
  );
router.route("/customer/noti").post(notification.createCustomer);
module.exports = router;
