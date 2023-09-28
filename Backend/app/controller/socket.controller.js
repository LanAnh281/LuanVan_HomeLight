const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
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
