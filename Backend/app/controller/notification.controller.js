const schedule = require("node-schedule");

const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const billMiddeware = require("../middeware/bill.middeware");

const { Notification } = require("../models/index.model.js");
const { dateTime } = require("../middeware/datetime.middeware");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
// io.on("connection", (socket) => {
//   console.log("Một client đã kết nối");

//   // Lắng nghe sự kiện từ client
//   socket.on("message", (data) => {
//     console.log("Dữ liệu từ client:", data);
//     // Gửi dữ liệu đến tất cả các client kết nối
//     io.emit("message", data);
//   });

//   // socket.on("createNoti", async (data) => {
//   //   console.log("Dữ liệu tạo thông báo:", data);
//   //   try {
//   //     const documentNoti = await Notification.create(data);
//   //     io.emit("noti", data);
//   //   } catch (error) {}

//   //   //1. thêm 1 thông báo mới
//   //   //2. gán danh sách vào user_noti
//   // });
// });
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
    io.on("connection", (socket) => {
      console.log("*** client đã kết nối");
      socket.on("createNoti", async (data) => {
        io.emit("noti", "abc1");
      });
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const documents = await Notification.findAll({});
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
