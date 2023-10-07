const express = require("express");
const router = express.Router();
const userNotification = require("../controller/user_notification.controller");
const authorization = require("../middeware/authorization.middeware");

router
  .route("/")
  .post(userNotification.create)
  .get(userNotification.findAll)
  .delete(userNotification.deleteAll);
router
  .route("/:id")
  .put(userNotification.updated)
  .get(userNotification.findOne)
  .delete(userNotification.delete);
router
  .route("/getAll/user")
  .get(
    authorization.authentication,
    authorization.authorization("xem thông báo"),
    userNotification.findAllUser
  );
module.exports = router;
