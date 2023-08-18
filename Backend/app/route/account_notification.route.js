const express = require("express");
const router = express.Router();
const accountNotification = require("../controller/account_notification.controller");
router
  .route("/")
  .get(accountNotification.findAll)
  .post(accountNotification.create);
router.route("/:id").post(accountNotification.update);

module.exports = router;
