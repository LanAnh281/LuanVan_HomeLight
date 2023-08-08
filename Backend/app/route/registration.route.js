const express = require("express");
const router = express.Router();
const Registration = require("../controller/registration.controller");
const upload = require("../middeware/upload.middeware");
router
  .route("/multiple")
  .post([upload.upload.array("files"), Registration.create]);
router.route("/").get(Registration.findAll);
router.route("/getImg/:id").get(Registration.getImg);
module.exports = router;
