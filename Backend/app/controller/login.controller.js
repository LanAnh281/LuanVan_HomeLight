const { Accounts, Positions } = require("../models/index.model.js");
const jwt = require("jsonwebtoken");
const secret = "asdfghjkl!@#";

const crypto = require("crypto");

const encryptionKey = "12345678912345678901234567890121";
const iv = "0123456789abcdef";

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
  console.log("req.body:", req.body);
  const { userName, password } = req.body;
  console.log(userName, password);
  try {
    const document = await Accounts.findOne({
      where: {
        userName: userName,
        password: password,
      },
    });
    if (document && document["isActive"]) {
      const position = await Positions.findOne({
        where: { _id: document["positionId"] },
      });
      const refreshToken = setEncrypt(document["_id"]);
      res.cookie("refreshToken", refreshToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), //1 year
        httpOnly: true,
        secure: true,
      });

      jwt.sign(document["_id"], secret, function (err, data) {
        return res.send({
          message: "success",
          status: "success",
          token: data,
          position: position["name"],
          _id: document["_id"],
        });
      });
    } else {
      res.json({ message: "fail", status: "fail" });
    }
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
exports.refreshAccessToken = async (req, res, next) => {
  const refreshToken = getDecrypt(req.cookies["refreshToken"]);
  console.log("refreshToken:", refreshToken);
  try {
    const document = await Accounts.findOne({
      where: {
        _id: refreshToken,
      },
    });
    if (document && document["isActive"]) {
      const position = await Positions.findOne({
        where: { _id: document["positionId"] },
      });
      const refreshToken = setEncrypt(document["_id"]);
      res.cookie("refreshToken", refreshToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        httpOnly: true,
        secure: true,
      });

      jwt.sign(document["_id"], secret, function (err, data) {
        return res.json({
          message: "success",
          status: "success",
          token: data,
          position: position["name"],
          _id: document["_id"],
        });
      });
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
