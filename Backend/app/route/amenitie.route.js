const express = require("express");
const Amenities = require("../controller/amenitie.controller");
const authorization = require("../middeware/authorization.middeware");
const router = express.Router();
router
  .route("/")
  .get(
    authorization.authentication,
    authorization.authorization("xem danh sách dịch vụ"),
    Amenities.findAll
  )
  .post([
    // authorization.authentication,
    // authorization.authorization("thêm dịch vụ"),
    Amenities.create,
  ]);
router
  .route("/:id")
  .post(
    authorization.authentication,
    authorization.authorization("xem danh sách dịch vụ"),
    Amenities.createAmenitiesRoom
  )
  .get(
    authorization.authentication,
    authorization.authorization("xem danh sách dịch vụ"),
    Amenities.findOne
  )
  .put(
    authorization.authentication,
    authorization.authorization("chỉnh sửa dịch vụ"),
    Amenities.updated
  )
  .delete(
    authorization.authentication,
    authorization.authorization("xóa dịch vụ"),
    Amenities.delete
  );
router.route("/getAll/user");
// .get(
//   authorization.authentication,
//   authorization.authorization("xem danh sách dịch vụ"),
//   Amenities.findAllUser
// );
module.exports = router;
