const express = require("express");
const room = require("../controller/room.controller");

const router = express.Router();
router.route("/").get(room.findAll).post(room.create);
router.route("/:id").get(room.findOne).put(room.updated).delete(room.delete);
module.exports = router;
