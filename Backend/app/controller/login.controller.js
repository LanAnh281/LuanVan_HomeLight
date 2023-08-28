const { Accounts, Positions } = require("../models/index.model.js");
const jwt = require("jsonwebtoken");
const secret = "asdfghjkl!@#";
const uuid = require("uuid");
const crypto = require("crypto");
const encryptionKey = "12345678912345678901234567890121";
const iv = "0123456789abcdef";

const { dateTime } = require("../middeware/datetime.middeware");
// const moment = require("moment");
const moment = require("moment-timezone");

const setEncrypt = (value) => {
  const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);
  let encrypted = cipher.update(value, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};
const getDecrypt = (name) => {
  if (name) {
    const decipher = crypto.createDecipheriv("aes-256-cbc", encryptionKey, iv);
    let decrypted = decipher.update(name, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
};

exports.login = async (req, res, next) => {
  let { userName, password } = req.body;
  console.log(userName, password);
  password = setEncrypt(password);
  try {
    const document = await Accounts.findOne({
      where: {
        userName: userName,
        password: password,
      },
    });
    if (!document) {
      return res.json({ message: "fail", status: "fail" });
    }
    if (document["isActive"]) {
      const position = await Positions.findOne({
        where: { _id: document["positionId"] },
      });
      const refreshToken = uuid.v4(); // string unique
      let refreshTokenExprityTime = moment();

      refreshTokenExprityTime = refreshTokenExprityTime.add(24, "hours"); // add 2 hours

      const updated = await Accounts.update(
        {
          refreshToken: refreshToken,
          refreshTokenExprityTime: refreshTokenExprityTime,
        },
        { where: { _id: document["_id"] } }
      );
      //set cookie at client-side
      res.cookie("refreshToken", refreshToken, {
        expires: refreshTokenExprityTime.toDate(), //
        httpOnly: true,
        secure: true,
      });
      //jwt
      const expiresInMinutes = 3; // Thời gian tồn tại của JWT (vd: 1 phút)
      const expiryTime = moment().add(expiresInMinutes, "hours");
      jwt.sign(
        { _id: document["_id"], position: position, exp: expiryTime.unix() },
        secret,
        function (err, data) {
          return res.send({
            message: "success",
            status: "success",
            token: data,
            position: position["name"],
            expiresIn: expiryTime,
          });
        }
      );
    } else {
      res.json({ message: "fail", status: "fail" });
    }
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
exports.refreshAccessToken = async (req, res, next) => {
  const refreshToken = req.cookies["refreshToken"];
  console.log(">>> refreshToken:", refreshToken);
  try {
    const document = await Accounts.findOne({
      where: {
        refreshToken: refreshToken,
      },
    });
    console.log(">>>>doc:", document);
    let currentTime = moment();
    if (!document) {
      return res.json({ message: "fail", status: "fail" });
    }

    if (
      document["isActive"] &&
      currentTime.isBefore(document["refreshTokenExprityTime"])
    ) {
      const position = await Positions.findOne({
        where: { _id: document["positionId"] },
      });
      const expiresInMinutes = 30; // Thời gian tồn tại của JWT (vd: 1 phút)
      const expiryTime = moment().add(expiresInMinutes, "hours");
      jwt.sign(
        { _id: document["_id"], position: position, exp: expiryTime.unix() },
        secret,
        function (err, data) {
          return res.json({
            message: "success",
            status: "success",
            token: data,
            position: position["name"],
            expiresIn: expiryTime,
          });
        }
      );
    } else {
      res.json({ message: "fail", status: "fail" });
    }
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
exports.clearRefreshToken = async (req, res, next) => {
  // Xóa cookie bằng cách đặt thời gian hết hạn về quá khứ
  res.cookie("refreshToken", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: true,
  });
  res.json({ message: "deleted token ", status: "success" });
};
