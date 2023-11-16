const express = require("express");
const router = express.Router();
const user = require("../controller/user.controller");
const authorization = require("../middeware/authorization.middeware");
const upload = require("../middeware/upload.middeware");
const request = require("../middeware/request.midderware");
router
  .route("/")
  .post([upload.upload.array("files"), user.createUserAndAccount]);
router.route("/").get(user.findAll).delete(user.delete);
router
  .route("/:id")
  .get([
    // authorization.authentication,
    // authorization.authorization("xem thông tin khách trọ"),
    user.findOne,
  ])
  .post([
    request.sanitizeDataMiddleware,
    authorization.authentication,
    authorization.authorization("thêm khách trọ"),
    upload.upload.array("files"),
    user.createUserAccountAndUpdateRoom,
  ])
  .delete(
    authorization.authentication,
    authorization.authorization("xóa khách trọ"),
    user.deleteOne
  )
  .put([upload.upload.array("files"), user.update]);
router.route("/getImg/:id").get(
  // authorization.authentication,
  // authorization.authorization("xem thông tin khách trọ"),
  user.getImg
);
router
  .route("/findAllTenant/:id")
  .get(
    authorization.authentication,
    authorization.authorization("xem thông tin khách trọ"),
    user.findAllTenant
  );
router
  .route("/findAllLandlord/landlord")
  .get(
    authorization.authentication,
    authorization.authorization("xem thông tin khách trọ"),
    user.findAllLandlord
  );
module.exports = router;
