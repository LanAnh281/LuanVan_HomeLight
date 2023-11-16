const express = require("express");
const router = express.Router();
const userNotification = require("../controller/user_notification.controller");
const authorization = require("../middeware/authorization.middeware");

router.route("/").post(userNotification.create).get(userNotification.findAll);

router
  .route("/:id")
  .put(
    authorization.authentication,
    authorization.authorization("xem thông báo"),
    userNotification.updated
  )
  .get(
    authorization.authentication,
    authorization.authorization("xem thông báo"),
    userNotification.findOne
  );

router
  .route("/getAll/user")
  .get(
    authorization.authentication,
    authorization.authorization("xem thông báo"),
    userNotification.findAllUser
  );
module.exports = router;
