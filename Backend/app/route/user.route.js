const express = require("express");
const router = express.Router();
const user = require("../controller/user.controller");
const upload = require("../middeware/upload.middeware");
router.route("/multiple").post([upload.upload.array("files"), user.create]);
router.route("/").get(user.findAll);
router.route("/getImg/:id").get(user.getImg);
module.exports = router;
