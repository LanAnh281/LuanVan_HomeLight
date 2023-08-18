const express = require("express");
const service = require("../controller/service.controller");

const router = express.Router();
router.route("/").get(service.findAll).post(service.create);
router
  .route("/:id")
  .get(service.findOne)
  .put(service.updated)
  .delete(service.delete);
module.exports = router;
