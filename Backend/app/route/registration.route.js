const express = require("express");
const router = express.Router();
const Registration = require("../controller/registration.controller");
const upload = require("../middeware/upload.middeware");
router
  .route("/multiple")
  .post([upload.upload.array("files"), Registration.create]);

module.exports = router;
