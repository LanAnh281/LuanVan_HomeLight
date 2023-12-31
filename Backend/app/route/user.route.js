const express = require("express");
const router = express.Router();
const user = require("../controller/user.controller");
const authorization = require("../middeware/authorization.middeware");
const upload = require("../middeware/upload.middeware");
router
  .route("/")
  .post([upload.upload.array("files"), user.createUserAndAccount]);
router.route("/").get(user.findAll).delete(user.delete);
router
  .route("/:id")
  .get([
    authorization.authentication,
    authorization.authorization("xem thông tin khách trọ"),
    user.findOne,
  ])
  .post([upload.upload.array("files"), user.createUserAccountAndUpdateRoom])
  .delete(user.deleteOne)
  .put([upload.upload.array("files"), user.update]);
router.route("/getImg/:id").get(user.getImg);
module.exports = router;
