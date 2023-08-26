const express = require("express");
const router = express.Router();
const user = require("../controller/user.controller");
const upload = require("../middeware/upload.middeware");
router
  .route("/")
  .post([upload.upload.array("files"), user.createUserAndAccount]);
router.route("/").get(user.findAll).delete(user.delete);
router
  .route("/:id")
  .get(user.findOne)
  .delete(user.deleteOne)
  .put([upload.upload.array("files"), user.update]);
router.route("/getImg/:id").get(user.getImg);
module.exports = router;
