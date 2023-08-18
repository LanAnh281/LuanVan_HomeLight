const { Account_Notification } = require("../models/index.model");
exports.create = async (req, res, next) => {
  const { accountId, notificationId } = req.body;
  try {
    const document = await Account_Notification.create({
      AccountId: accountId,
      NotificationId: notificationId,
      isdelete: false,
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const document = await Account_Notification.findAll({});
    res.json({ message: document, status: "success" });
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
exports.update = async (req, res, next) => {
  const { accountId, notificationId, isdelete } = req.body;
  console.log("account noti:", req.body);
  try {
    const document = await Account_Notification.update(
      {
        AccountId: accountId,
        NotificationId: notificationId,
        isdelete: isdelete,
      },
      {
        where: {
          AccountId: accountId,
          NotificationId: notificationId,
        },
      }
    );
    res.json({ message: document, status: "success" });
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
