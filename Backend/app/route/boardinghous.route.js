const express = require("express");
const BorardingHouse = require("../controller/boardinghouse.controller");
const authorization = require("../middeware/authorization.middeware");
const request = require("../middeware/request.midderware");
const upload = require("../middeware/upload.middeware");
const FormatImg = require("../middeware/formatImg");

const router = express.Router();
router
  .route("/")
  .get(BorardingHouse.findAll) // xem thông tin nhà trọ
  .post([
    request.sanitizeDataMiddleware,
    authorization.authentication,
    authorization.authorization("thêm nhà trọ"),
    upload.uploadStatic.array("files"),
    FormatImg.format,
    BorardingHouse.create,
  ]);
router
  .route("/:id")
  .get(BorardingHouse.findOne)
  .put([
    request.sanitizeDataMiddleware,
    authorization.authentication,

    authorization.authorization("chỉnh sửa nhà trọ"),
    upload.uploadStatic.array("files"),
    FormatImg.format,
    BorardingHouse.updated,
  ])
  .delete([
    authorization.authentication,
    authorization.authorization("xóa nhà trọ"),
    BorardingHouse.delete,
  ]);
router.route("/getAll/user").get([
  authorization.authentication,
  authorization.authorization("xem danh sách nhà trọ"), // ds nhà trọ của 1 user đang đăng nhập
  BorardingHouse.findAllUser,
]);
module.exports = router;
