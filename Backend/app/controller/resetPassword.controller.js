const { ResetPassword, Users, Accounts } = require("../models/index.model");
const moment = require("moment-timezone");

const crypto = require("crypto");
const encryptionKey = "12345678912345678901234567890121";
const iv = "0123456789abcdef";
const setEncrypt = (value) => {
  const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);
  let encrypted = cipher.update(value, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

exports.create = async (req, res, next) => {
  const { email } = req.body;
  const resetPasswordExprityTime = moment().add(3, "minutes");
  try {
    const user = await Accounts.findOne({
      where: {
        userName: email,
      },
    });
    if (user) {
      const document = await ResetPassword.create({
        email: email,
        resetPasswordExprityTime: resetPasswordExprityTime,
      });
      res.json({ message: document, status: "success" });
    } else {
      res.json({ message: error, status: "fail" });
    }
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
exports.update = async (req, res, next) => {
  let { password } = req.body;
  password = setEncrypt(password);
  const currentTime = moment();
  try {
    const reset = await ResetPassword.findOne({
      where: {
        _id: req.params.id,
      },
    });
    if (reset && currentTime.isBefore(reset["resetPasswordExprityTime"])) {
      const document = await Accounts.update(
        { password: password },
        { where: { userName: reset["email"] } }
      );
      res.json({ message: document, status: "success" });
    } else {
      res.json({ message: "fail", status: "fail" });
    }
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
