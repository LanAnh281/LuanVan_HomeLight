const express = require("express");
const role = require("../controller/role.controller");

const router = express.Router();
router.route("/").get(role.findAll).post(role.create);
router.route("/:id").get(role.findOne).put(role.updated).delete(role.delete);
module.exports = router;
