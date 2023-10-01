const schedule = require("node-schedule");

const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const billMiddeware = require("../middeware/bill.middeware");

// Đặt lịch thực hiện lệnh vào ngày cuối cùng của mỗi tháng
const job = schedule.scheduleJob("0 0 0 * * *", async () => {
  const currentDate = new Date();
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  console.log("tạo bill cuối tháng", lastDayOfMonth);
  if (currentDate.getDate() === lastDayOfMonth) {
    console.log("Lệnh đã được thực thi vào ngày cuối của tháng.");
    const bill = await billMiddeware.create();
    console.log(bill);
    io.emit("billProcessed", bill);
    // Đặt lệnh bạn muốn thực hiện ở đây 0 0 0 * * *
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
    io.emit("message1", data);
  });
});

module.exports = io; // Xuất đối tượng socket.io để sử dụng trong app.js
