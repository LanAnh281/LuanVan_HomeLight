const express = require("express");
const note = require("../controller/note.controller");

const router = express.Router();
router.route("/").get(note.findAll).post(note.create);
router.route("/:id").get(note.findOne).put(note.updated).delete(note.delete);
module.exports = router;
