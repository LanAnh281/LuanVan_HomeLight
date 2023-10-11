const { Notification } = require("../models/index.model.js");
const { dateTime } = require("../middeware/datetime.middeware");

exports.create = async (req, res, next) => {
  let { date, content } = req.body;
  console.log("Notification Body:", req.body);
  date = date == null ? null : dateTime(date);
  try {
    const document = await Notification.create({
      date: date,
      content: content,
      sender: req.user.userId,
    });
    // io.on("connection", (socket) => {
    //   console.log("*** client đã kết nối");
    //   socket.on("createNoti", async (data) => {
    //     io.emit("noti", "abc1");
    //   });
    // });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.createCustomer = async (req, res, next) => {
  let { date, content } = req.body;
  console.log("Notification Body:", req.body);
  date = date == null ? null : dateTime(date);
  try {
    const document = await Notification.create({
      date: date,
      content: content,
      sender: "Khách vãng lai",
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const notis = await Notification.findAll({});
    let documents = JSON.parse(JSON.stringify(notis));
    documents = documents.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findAllUser = async (req, res, next) => {
  try {
    const notis = await Notification.findAll({
      where: {
        sender: req.user.userId,
      },
    });
    let documents = JSON.parse(JSON.stringify(notis));
    documents = documents.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const document = await Notification.findAll({
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
  console.log("Notification Body:", req.body);
  date = date == null ? null : dateTime(date);
  try {
    const document = await Notification.update(
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
    const document = await Notification.destroy({
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
    const documents = await Notification.destroy({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
