const express = require("express");
const BorardingHouse = require("../controller/boardinghouse.controller");
const authorization = require("../middeware/authorization.middeware");
const router = express.Router();
router
  .route("/")
  .get(BorardingHouse.findAll)
  .post([
    authorization.authentication,
    authorization.authorization("create-boarding"),
    BorardingHouse.create,
  ]);
router
  .route("/:id")
  .get(BorardingHouse.findOne)
  .put(BorardingHouse.updated)
  .delete([authorization.authorization, BorardingHouse.delete]);
module.exports = router;
