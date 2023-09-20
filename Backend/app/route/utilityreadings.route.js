const express = require("express");
const UtilityReadings = require("../controller/utilityreadings.controler");
const authorization = require("../middeware/authorization.middeware");
const router = express.Router();
router.route("/").get(UtilityReadings.findAll).post([
  // authorization.authentication,
  // authorization.authorization("thêm dịch vụ"),
  UtilityReadings.create,
]);
router
  .route("/:id")
  .get(UtilityReadings.findOne)
  .put(
    // authorization.authentication,
    // authorization.authorization("chỉnh sửa dịch vụ"),
    UtilityReadings.updated
  )
  .delete(UtilityReadings.delete);
module.exports = router;
