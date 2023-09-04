const express = require("express");
const room = require("../controller/room.controller");
const authorization = require("../middeware/authorization.middeware");
const request = require("../middeware/request.midderware");
const upload = require("../middeware/upload.middeware");

const router = express.Router();
router
  .route("/")
  .get(room.findAll)
  .post([
    request.sanitizeDataMiddleware,
    authorization.authentication,
    upload.upload.array("files"),
    authorization.authorization("thêm phòng trọ"),
    room.create,
  ]);
router
  .route("/:id")
  .get(room.findOne)
  .put(room.updated)
  .delete([
    request.sanitizeDataMiddleware,
    authorization.authentication,
    authorization.authorization("thêm phòng trọ"),
    room.delete,
  ]);
module.exports = router;
