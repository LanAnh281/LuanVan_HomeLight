const { Accounts } = require("../models/index.model.js");

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

exports.create = async (req, res, next) => {
  let { userName, password, userId, positionId } = req.body;
  console.log("Account Body:", req.body);
  password = setEncrypt(password);
  try {
    const document = await Accounts.create({
      userName: userName,
      password: password,
      isActive: 1,
      userId: userId,
      positionId: positionId,
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const documents = await Accounts.findAll({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const document = await Accounts.findAll({
      where: {
        _id: req.params.id,
      },
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.updated = async (req, res, next) => {
  let { userName, password, userId, positionId, isActive } = req.body;
  console.log("Update account", req.body);
  password = setEncrypt(password);

  try {
    const document = await Accounts.update(
      {
        userName: userName,
        password: password,
        isActive: isActive,
        userId: userId,
        positionId: positionId,
      },
      {
        where: {
          _id: req.params.id,
        },
      }
    );
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.delete = async (req, res, next) => {
  try {
    const document = await Accounts.destroy({
      where: {
        _id: req.params.id,
      },
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.deleteAll = async (req, res, next) => {
  try {
    const documents = await Accounts.destroy({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
