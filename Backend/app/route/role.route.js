const express = require("express");
const role = require("../controller/role.controller");
const authorization = require("../middeware/authorization.middeware");
const request = require("../middeware/request.midderware");

const router = express.Router();
router
  .route("/")
  .get(role.findAll)
  .post([
    request.sanitizeDataMiddleware,
    authorization.authentication,
    authorization.authorization("create-role"),
    role.create,
  ]);
router.route("/:id").get(role.findOne).put(role.updated).delete(role.delete);
module.exports = router;
