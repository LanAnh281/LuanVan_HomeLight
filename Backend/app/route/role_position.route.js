const express = require("express");
const router = express.Router();
const Roles_Positions = require("../controller/role_position.controller");
const authorization = require("../middeware/authorization.middeware");
const request = require("../middeware/request.midderware");

router
  .route("/")
  .post([
    request.sanitizeDataMiddleware,
    authorization.authentication,
    authorization.authorization("thêm quyền cho một vị trí"),
    Roles_Positions.create,
  ]);
// .get(Roles_Positions.findAll);
router
  .route("/:id")
  .get(
    authorization.authentication,
    authorization.authorization("xem danh sách quyền một vị trí"),
    Roles_Positions.findOne
  )
  .post([
    request.sanitizeDataMiddleware,
    authorization.authentication,
    authorization.authorization("xóa quyền cho một vị trí"),
    Roles_Positions.deleteOne,
  ]);

module.exports = router;
