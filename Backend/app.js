// npm packages
const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
//route
const accountRouter = require("./app/route/account.route");
const loginRouter = require("./app/route/login.route");
const userRouter = require("./app/route/user.route");
const roleRouter = require("./app/route/role.route");
const positionRouter = require("./app/route/position.route");
const rolePositionRouter = require("./app/route/role_position.route");
const cycleRouter = require("./app/route/cycle.route");
const boardingHouseRouter = require("./app/route/boardinghous.route");
const roomRouter = require("./app/route/room.route");
const noteRouter = require("./app/route/note.route");
const serviceRouter = require("./app/route/service.route");
const equipmentRouter = require("./app/route/equipment.route");
const billRouter = require("./app/route/bill.route");
const receiptRouter = require("./app/route/receipt.route");
const userRoomRouter = require("./app/route/user_room.route");
const serviceRoomRoter = require("./app/route/service_room.route");
const countRouter = require("./app/route/count.route");
const spendingRouter = require("./app/route/spending.route");
const notificationRouter = require("./app/route/notification.route");
const accountNotification = require("./app/route/account_notification.route");
const mailRouter = require("./app/route/mail.route");
const resetPasswordRouter = require("./app/route/resetPassword.route");
const uploadRouter = require("./app/route/upload.route");
const ruleRouter = require("./app/route/rule.route");

//midderware
const requestMidderware = require("./app/middeware/request.midderware");
// initialize
const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//socket
const http = require("http");
const server = http.createServer(app);

server.listen(3000, () => {
  console.log(`Server is listening on port`);
});

// simple route

app.use("/static", express.static(path.join(__dirname, "static")));

app.get("/", (req, res, next) => {
  return res.send({
    message: "Welcom to Personal HomeLight System",
  });
});

app.use("/api/accounts", accountRouter);
app.use("/api/login", loginRouter);
app.use("/api/users", userRouter);
app.use("/api/role", roleRouter);
app.use("/api/roleposition", rolePositionRouter);
app.use("/api/position", positionRouter);
app.use("/api/cycle", cycleRouter);
app.use("/api/boardinghouse", boardingHouseRouter);
app.use("/api/room", roomRouter);
app.use("/api/note", noteRouter);
app.use("/api/equipment", equipmentRouter);
app.use("/api/service", serviceRouter);
app.use("/api/bill", billRouter);
app.use("/api/receipt", receiptRouter);
app.use("/api/userroom", userRoomRouter);
app.use("/api/serviceroom", serviceRoomRoter);
app.use("/api/count", countRouter);
app.use("/api/spending", spendingRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/accountnotification", accountNotification);
app.use("/api/mail", mailRouter);
app.use("/api/resetPassword", resetPasswordRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/rule", ruleRouter);

// check errors
app.use((req, res, next) => {
  return next(createError(404, "Resource Not Found"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// exports
module.exports = app;
