const { sequelize } = require("../config/index");
const {
  Users,
  Accounts,
  Positions,
  Rooms,
  User_Room,
  LandlordTenant,
  BorardingHouse,
  Payment,
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

exports.createUserAndAccount = async (userData) => {
  const transaction = await sequelize.transaction();
  try {
    // console.log("USER DATA:", userData);
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

    if (userData.clientId != "" && userData.secretId != "") {
      const documentPayment = await Payment.create(
        {
          userId: newUser._id,
          clientId: userData.clientId,
          secretId: userData.secretId,
        },
        {
          transaction,
        }
      );
    }
    await transaction.commit();
    return { message: "success", status: "success" };
  } catch (error) {
    if (transaction) {
      if (!transaction.finished) {
        console.log(">>>Error", error);
        await transaction.rollback();
      }
    }
    throw error;
  }
};
exports.createUserAccountAndUpdateRoom = async (userData) => {
  const transaction = await sequelize.transaction();
  try {
    const landlord = await Users.findOne({
      where: {
        _id: userData.landlordId,
      },
    });
    userData.isPay = landlord.isPay;
    const newUser = await Users.create(userData, { transaction });
    if (userData.landlordId && newUser._id) {
      const documentLandlordTenant = await LandlordTenant.create(
        { landlordId: userData.landlordId, tenantId: newUser._id },
        { transaction }
      );
    }
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
        console.log(">>>Error", error);
        await transaction.rollback();
      }
      return { message: error, status: "fail1" };
    }
    // throw error;
    return { message: error, status: "fail2" };
  }
};

exports.deleteBoardingAndRooms = async (data) => {
  const transaction = await sequelize.transaction();
  try {
    const documentBoarding = await BorardingHouse.update(
      {
        isDelete: true,
      },
      {
        where: {
          _id: data._id,
        },
      },

      { transaction }
    );
    const documentRooms = await Rooms.findAll({
      where: {
        BoardingId: data._id,
      },
    });
    for (let value of documentRooms) {
      const deleteRoom = await Rooms.update(
        {
          isDelete: true,
        },
        {
          where: {
            _id: value._id,
          },
        },
        { transaction }
      );
    }

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
