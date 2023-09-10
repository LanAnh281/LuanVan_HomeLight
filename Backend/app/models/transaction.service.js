const { sequelize } = require("../config/index");
const {
  Users,
  Accounts,
  Positions,
  Roles_Positions,
  Rooms,
  User_Room,
} = require("../models/index.model");

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

    const position = await Positions.findOne({ where: { name: "admin" } });
    let password = setEncrypt(userData.password);
    let accountData = {
      userName: newUser.email,
      password: password,
      isActive: 1,
      userId: newUser._id,
      positionId: position._id,
    };
    const newAccount = await Accounts.create(accountData, { transaction });

    await transaction.commit();
    return { message: "success", status: "success" };
  } catch (error) {
    if (transaction) {
      if (!transaction.finished) {
        console.log(">>>Error");
        await transaction.rollback();
      }
    }
    throw error;
  }
};
exports.createUserAccountAndUpdateRoom = async (userData) => {
  const transaction = await sequelize.transaction();
  try {
    const newUser = await Users.create(userData, { transaction });

    const position = await Positions.findOne({ where: { name: "user" } });
    let password = setEncrypt(userData.password);
    let accountData = {
      userName: newUser.email,
      password: password,
      isActive: 1,
      userId: newUser._id,
      positionId: position._id,
    };
    const newAccount = await Accounts.create(accountData, { transaction });
    const updateRoom = await Rooms.update(
      {
        status: userData.status,
        cycleId: userData.cycleId,
      },
      {
        where: {
          _id: userData.roomId,
        },
      },
      { transaction }
    );

    const newUserRoom = await User_Room.create(
      {
        RoomId: userData.roomId,
        UserId: newUser._id,
        start: userData.start,
        end: userData.end,
      },
      { transaction }
    );
    await transaction.commit();
    return { message: "success", status: "success" };
  } catch (error) {
    if (transaction) {
      if (!transaction.finished) {
        console.log(">>>Error");
        await transaction.rollback();
      }
    }
    throw error;
  }
};
