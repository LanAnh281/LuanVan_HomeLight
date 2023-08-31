const express = require("express");
const router = express.Router();
const Roles_Positions = require("../controller/role_position.controller");
router.route("/").post(Roles_Positions.create).get(Roles_Positions.findAll);
router
  .route("/:id")
  .get(Roles_Positions.findOne)
  .post(Roles_Positions.deleteOne);

module.exports = router;
