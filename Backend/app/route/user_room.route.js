const express = require("express");
const router = express.Router();
const userRoom = require("../controller/user_room.controller");
router.route("/").post(userRoom.create).get(userRoom.findAll);
router
  .route("/:id")
  .post(userRoom.updated)
  .get(userRoom.findOne)
  .delete(userRoom.deleteAll);
router.route("/delete/:id").post(userRoom.delete);
module.exports = router;
