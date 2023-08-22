const jwt = require("jsonwebtoken");
const { Accounts, Positions } = require("../models/index.model.js");
const jwt = require("jsonwebtoken");
const secret = "asdfghjkl!@#";

const crypto = require("crypto");
const encryptionKey = "12345678912345678901234567890121";
const iv = "0123456789abcdef";

const { dateTime } = require("../middeware/datetime.middeware");
const moment = require("moment");

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
exports.checkRefreshToken = (req, res, next) => {
  try {
  } catch (error) {}
};
