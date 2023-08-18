const express = require("express");
const BorardingHouse = require("../controller/boardinghouse.controller");

const router = express.Router();
router.route("/").get(BorardingHouse.findAll).post(BorardingHouse.create);
router
  .route("/:id")
  .get(BorardingHouse.findOne)
  .put(BorardingHouse.updated)
  .delete(BorardingHouse.delete);
module.exports = router;
