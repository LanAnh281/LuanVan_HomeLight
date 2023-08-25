const { sequelize } = require("../config/index");
const { Users, Accounts } = require("../models/index.model");

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
exports.createUserAndAccount = async (userData) => {
  const transaction = await sequelize.transaction();
  try {
    const newUser = await Users.create(userData, { transaction });
    let password = setEncrypt(userData.password);
    let accountData = {
      userName: userData.email,
      password: password,
      isActive: 1,
      userId: newUser._id,
      //   positionId: userData.positionId,
      positionId: "40c233ed-f002-4b03-809c-9cd43a8391cf",
    };

    const newAccount = await Accounts.create(accountData, { transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
