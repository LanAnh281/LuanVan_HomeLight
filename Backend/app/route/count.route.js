const express = require("express");
const router = express.Router();
const count = require("../controller/count.controller");
router.route("/").post(count.create).get(count.findAll);
router
  .route("/:id")
  .post(count.updated)
  .get(count.findOne)
  .delete(count.deleteAll);
router.route("/delete/:id").post(count.delete);
module.exports = router;
