const express = require("express");
const router = express.Router();
const login = require("../controller/login.controller");
const authorization = require("../middeware/authorization.middeware.js");

router.route("/").post(login.login);
router.route("/accessToken").post(login.refreshAccessToken);
router.route("/clearToken").post([login.clearRefreshToken]);

module.exports = router;
