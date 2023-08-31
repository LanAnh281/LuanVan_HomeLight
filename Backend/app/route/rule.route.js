const express = require("express");
const rule = require("../controller/rule.controller");

const router = express.Router();
router.route("/").get(rule.findAll).post(rule.create);
router.route("/:id").get(rule.findOne).put(rule.updated).delete(rule.delete);
module.exports = router;
