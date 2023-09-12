const express = require("express");
const service = require("../controller/service.controller");
const authorization = require("../middeware/authorization.middeware");
const router = express.Router();
router
  .route("/")
  .get(service.findAll)
  .post([
    authorization.authentication,
    authorization.authorization("thêm dịch vụ"),
    service.create,
  ]);
router
  .route("/:id")
  .get(service.findOne)
  .put(
    authorization.authentication,
    authorization.authorization("cập nhật dịch vụ"),
    service.updated
  )
  .delete(service.delete);
module.exports = router;
