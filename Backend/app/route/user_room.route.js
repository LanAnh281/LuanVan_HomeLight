const express = require("express");
const router = express.Router();
const userRoom = require("../controller/user_room.controller");
const authorization = require("../middeware/authorization.middeware");

router.route("/").post(userRoom.create).get(userRoom.findAll);
router
  .route("/:id")
  .post(userRoom.updated)
  .get([
    authorization.authentication,
    authorization.authorization("xem danh sách khách trọ"),
    userRoom.findOne,
  ])
  .delete(userRoom.deleteAll);
router.route("/delete/:id").post(userRoom.delete);
router.route("/room/:id").get(userRoom.findAllRoom);
module.exports = router;
