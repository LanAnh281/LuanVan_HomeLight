const express = require("express");
const position = require("../controller/position.controller");
const authorization = require("../middeware/authorization.middeware");
const request = require("../middeware/request.midderware");

const router = express.Router();
router
  .route("/")
  .get(
    authorization.authentication,
    authorization.authorization("xem danh sách vai trò"),
    position.findAll
  );
//   .post(position.create);
// router
//   .route("/:id")
//   .get(position.findOne)
//   .put(position.updated)
//   .delete(position.delete);
module.exports = router;
