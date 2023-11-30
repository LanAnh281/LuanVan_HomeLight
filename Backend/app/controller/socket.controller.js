const schedule = require("node-schedule");

const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const billMiddeware = require("../middeware/bill.middeware");
const { Notification } = require("../models/index.model");

// Đặt lịch thực hiện lệnh vào ngày cuối cùng của mỗi tháng
const job = schedule.scheduleJob("0 0 0 * * *", async () => {
  const currentDate = new Date();
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  console.log("tạo bill cuối tháng", lastDayOfMonth, currentDate.getDate());
  // const billUser = await billMiddeware.createBill_user();
  // console.log("BIll Users:", billUser);
  // const bill = await billMiddeware.create();
  // io.emit("noti", "Thành công");
  if (currentDate.getDate() === lastDayOfMonth) {
    console.log("Lệnh đã được thực thi vào ngày cuối của tháng. 30,31");
    // Bill dành cho khách trọ
    const bill = await billMiddeware.create();
    // Bill dành cho chủ trọ
    const billUser = await billMiddeware.createBill_user();
    io.emit("noti", "Tạo hóa đơn tự động thành công");
    // Đặt lệnh bạn muốn thực hiện ở đây 0 0 0 * * *, 1 phút */1 * * * *, 59 59 23 * * *
  }
});

// const job = schedule.scheduleJob("*/1 * * * *", async () => {
//   console.log("Lệnh sẽ thực thi sau mỗi 1 phút.");

//   try {
//     // Đặt lệnh bạn muốn thực hiện ở đây

//     const bill = await billMiddeware.create();
//     console.log(bill);
//     io.emit("billProcessed", bill);
//   } catch (error) {
//     console.error("Lỗi khi gọi billMiddeware.findAll():", error);
//   }
// });
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log("Một client đã kết nối");

  // Lắng nghe sự kiện từ client
  socket.on("message", (data) => {
    console.log("Dữ liệu từ client:", data);
    // Gửi dữ liệu đến tất cả các client kết nối
    io.emit("message", data);
  });

  socket.on("createNoti", async (data) => {
    console.log("Dữ liệu tạo thông báo:", data);
    io.emit("noti", "Thành công");

    //1. thêm 1 thông báo mới
    //2. gán danh sách vào user_noti
  });
});

module.exports = io; // Xuất đối tượng socket.io để sử dụng trong app.js
