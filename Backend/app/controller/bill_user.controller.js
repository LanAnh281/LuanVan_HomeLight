const { Bill_User, Receipt, Users } = require("../models/index.model.js");
const { sequelize } = require("../config/index");
exports.findAll = async (req, res, next) => {
  try {
    const documents = await Bill_User.findAll({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "fail" });
  }
};
exports.findAllUser = async (req, res, next) => {
  try {
    console.log("req.user.userId:", req.user.userId);
    const documents = await sequelize.query(
      `
      SELECT Users._id, bill_users.total, receipts.receive,receipts.createdAt
      FROM Users
    left JOIN bill_users ON Users._id = bill_users.userId
    left JOIN receipts ON bill_users._id = receipts.billUserId
    where Users._id= '${req.user.userId}'
    ORDER BY receipts.createdAt DESC
  `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "fail" });
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const document = await Bill_User.findAll({
      where: {
        _id: req.params.id,
      },
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "fail" });
  }
};
