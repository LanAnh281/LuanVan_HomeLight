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
