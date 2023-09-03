const express = require("express");
const BorardingHouse = require("../controller/boardinghouse.controller");
const authorization = require("../middeware/authorization.middeware");
const router = express.Router();
router
  .route("/")
  .get(BorardingHouse.findAll)
  .post([
    authorization.authentication,
    authorization.authorization("thêm nhà trọ"),
    BorardingHouse.create,
  ]);
router
  .route("/:id")
  .get(BorardingHouse.findOne)
  .put(BorardingHouse.updated)
  .delete([
    authorization.authentication,
    authorization.authorization("xóa nhà trọ"),
    BorardingHouse.delete,
  ]);
module.exports = router;
