const { Bill_User, Receipt, Users } = require("../models/index.model.js");
const { sequelize } = require("../config/index");
exports.findAll = async (req, res, next) => {
  try {
    // const documents = await Bill_User.findAll({});
    const documents = await sequelize.query(
      `
      SELECT Users._id as userId,users.username,bill_users._id, bill_users.total, bill_users.content,bill_users.createdAt,receipts.receive
      FROM Users
    left JOIN bill_users ON Users._id = bill_users.userId
    left JOIN receipts ON bill_users._id = receipts.billUserId
  where users.isUser=true
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
exports.findAllUser = async (req, res, next) => {
  try {
    const documents = await sequelize.query(
      `
      SELECT Users._id as userId, Users.userName,bill_users._id ,bill_users.total, bill_users.content, bill_users.createdAt, receipts.receive, receipts.updatedAt 
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
    // const document = await Bill_User.findAll({
    //   where: {
    //     _id: req.params.id,
    //   },
    // });
    const document = await sequelize.query(
      `
      SELECT Users._id as userId,users.username,bill_users._id, bill_users.total, 
      bill_users.content,bill_users.createdAt,
      receipts.receive,receipts.updatedAt as receiptedAt
      FROM Users
    left JOIN bill_users ON Users._id = bill_users.userId
    left JOIN receipts ON bill_users._id = receipts.billUserId
  where bill_users._id ='${req.params.id}'
    
  `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "fail" });
  }
};
