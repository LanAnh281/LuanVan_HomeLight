const express = require("express");
const router = express.Router();
const serviceRoom = require("../controller/service_room.controller");
router.route("/").post(serviceRoom.create).get(serviceRoom.findAll);
router
  .route("/:id")
  .post(serviceRoom.updated)
  .get(serviceRoom.findOne)
  .delete(serviceRoom.deleteAll);
router.route("/delete/:id").post(serviceRoom.delete);
module.exports = router;
