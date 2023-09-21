const express = require("express");
const router = express.Router();
const userRoom = require("../controller/user_room.controller");
const authorization = require("../middeware/authorization.middeware");

router.route("/").post(userRoom.create).get(userRoom.findAll);
router
  .route("/:id")
  .get([
    authorization.authentication,
    authorization.authorization("xem danh sách khách trọ"),
    userRoom.findOne,
  ]);

router
  .route("/delete/:id")
  .post(
    authorization.authentication,
    authorization.authorization("trả phòng"),
    userRoom.delete
  );
router
  .route("/room/:id")
  .get(
    authorization.authentication,
    authorization.authorization("xem danh sách khách trọ"),
    userRoom.findAllRoom
  )
  .delete([
    authorization.authentication,
    authorization.authorization("xem danh sách khách trọ"),
    userRoom.deleteAll,
  ]);
module.exports = router;
