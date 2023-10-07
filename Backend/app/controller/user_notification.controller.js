const {
  User_Notification,
  Notification,
  Users,
} = require("../models/index.model.js");
exports.create = async (req, res, next) => {
  try {
    const { isDelete, isRead, UserId, NotificationId } = req.body;
    const documentUserNoti = await User_Notification.create({
      isDelete: false,
      isRead: false,
      UserId: UserId,
      NotificationId: NotificationId,
    });
    res.json({ message: documentUserNoti, status: "success" });
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const documents = await User_Notification.findAll({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findAllUser = async (req, res, next) => {
  try {
    const userNotis = await Users.findByPk(req.user.userId, {
      include: [
        {
          model: Notification,
          //   through: {
          //     // Nếu bạn có một tên cột khác để liên kết, hãy thay đổi 'userId' thành tên cột đó.
          //     where: {
          //       userId: req.user.userId,
          //     },
          //   },
        },
      ],
    });
    let documents = JSON.parse(JSON.stringify(userNotis));
    documents.Notification = documents.Notifications.sort((a, b) => {
      return (
        new Date(b.User_Notification.createdAt) -
        new Date(a.User_Notification.createdAt)
      );
    });
    // console.log(documents);
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const document = await User_Notification.findAll({
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
  let { date, content } = req.body;
  console.log("User_Notification Body:", req.body);
  date = date == null ? null : dateTime(date);
  try {
    const document = await User_Notification.update(
      {
        date: date,
        content: content,
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
    const document = await User_Notification.destroy({
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
    const documents = await User_Notification.destroy({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
