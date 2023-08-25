const express = require("express");
const router = express.Router();
const uploadId = require("../controller/upload.controller");
const upload = require("../middeware/upload.middeware");
router.route("/").post([upload.upload.single("files"), uploadId.create]);
router.route("/:id").get(uploadId.wel);
// router
//   .route("/:id")
//   .get(user.findOne)
//   .delete(user.deleteOne)
//   .put([upload.upload.array("files"), user.update]);
// router.route("/getImg/:id").get(user.getImg);
module.exports = router;
