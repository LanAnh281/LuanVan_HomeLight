// npm packages
const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// const _ = require("lodash");
// const multer = require("multer");
// const fs = require("fs");
//route
const accountRouter = require("./app/route/account.route");
const loginRouter = require("./app/route/login.route");
const registrationRouter = require("./app/route/registration.route");

const customerRouter = require("./app/route/customer.route");

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

// handles before https methods
const convertToLowercase = (req, res, next) => {
  for (let key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].toLowerCase();
    }
  }
  next();
};

app.use(convertToLowercase);
//

app.use("/api/accounts", accountRouter);
app.use("/api/login", loginRouter);
app.use("/api/registration", registrationRouter);
app.use("/api/customers", customerRouter);

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
//   if (!allowedTypes.includes(file.mimetype)) {
//     const error = new Error("Wrong file type");
//     error.code = "LIMIT_FILE_TYPES";
//     return cb(error, false);
//   }
//   cb(null, true);
// };

// const storage = multer.diskStorage({
//   destination: "../../uploads",
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const fileExtension = path.extname(file.originalname);
//     cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
//   },
// });

// const MAX_SIZE = 200000;
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: MAX_SIZE,
//   },
// });

// app.use("/multiple", upload.array("files"), (req, res, next) => {
//   // Truy cập thư mục "uploads/" và lấy danh sách các tên file đã được lưu
//   fs.readdir(uploadDir, (err, files) => {
//     if (err) {
//       console.error("Error reading upload directory:", err);
//       // Xử lý lỗi nếu cần thiết
//       return;
//     }

//     // Sắp xếp danh sách các tên file theo thời gian tạo (sử dụng mtime)
//     files.sort((file1, file2) => {
//       const stat1 = fs.statSync(path.join(uploadDir, file1));
//       const stat2 = fs.statSync(path.join(uploadDir, file2));
//       return stat2.mtime - stat1.mtime;
//     });

//     // Lấy hai tệp mới nhất
//     const newestFiles = files.slice(0, 2);

//     // Lưu danh sách hai tệp mới nhất vào cơ sở dữ liệu hoặc xử lý theo nhu cầu của bạn
//     console.log("Newest files:", newestFiles);
//   });
//   res.send({ message: "success", file: req.files });
// });
// // check errors
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
