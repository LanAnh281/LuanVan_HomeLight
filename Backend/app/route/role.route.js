const express = require("express");
const role = require("../controller/role.controller");
const authorization = require("../middeware/authorization.middeware");
const request = require("../middeware/request.midderware");

const router = express.Router();
router
  .route("/")
  .get(
    authorization.authentication,
    authorization.authorization("xem danh sách quyền"),
    role.findAll
  )
  .post([
    request.sanitizeDataMiddleware,
    authorization.authentication,
    authorization.authorization("thêm quyền"),
    role.create,
  ]);
// router.route("/:id").get(role.findOne);
// .put([
//   authorization.authentication,
//   authorization.authorization("thay đổi quyền"),
//   role.updated,
// ])
// .delete(role.delete);
module.exports = router;
