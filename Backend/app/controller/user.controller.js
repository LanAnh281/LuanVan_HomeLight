const {
  Users,
  Accounts,
  LandlordTenant,
  BorardingHouse,
  User_Room,
  Rooms,
} = require("../models/index.model");
const { dateTime } = require("../middeware/datetime.middeware");

const fs = require("fs");
const uploadDir = "./uploads/images";
const path = require("path");

const {
  createUserAndAccount,
  createUserAccountAndUpdateRoom,
} = require("../models/transaction.service");
const nodemailer = require("nodemailer");
const setPassword = () => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";

  for (let i = 0; i < 9; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};
exports.createUserAndAccount = async (req, res) => {
  let {
    userName,
    identification,
    phone,
    address,
    email,
    start,
    end,
    numberPlate,
    sex,
    birthday,
    securityDeposit,
    file,
  } = req.body;
  const password = setPassword();
  end = end === "" ? null : end;
  start = start === "" ? null : start;
  try {
    fs.readdir(uploadDir, async (err, files) => {
      if (err) {
        console.error("Error reading upload directory:", err);
        return;
      }
      let newestFiles = [];
      if (files[0] != "") {
        //sort the file list by time (using mtime)
        // sort in descending order-
        files.sort((file1, file2) => {
          const stat1 = fs.statSync(path.join(uploadDir, file1));
          const stat2 = fs.statSync(path.join(uploadDir, file2));
          return stat2.mtime - stat1.mtime;
        });

        // Retrieve the two most recent files.
        newestFiles = files.slice(0, 2);
      } else {
        newestFiles = [...file];
      }
      const userData = {
        userName: userName,
        identification: identification,
        imagePrevious: newestFiles[0],
        imageAfter: newestFiles[1],
        phone: phone,
        address: address,
        email: email,
        start: start,
        end: end,
        numberPlate: numberPlate,
        sex: sex,
        birthday: birthday,
        securityDeposit: securityDeposit,
        password: password,
      };
      const result = await createUserAndAccount(userData);
      if (result.status == "success") {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "nguyenanh160201@gmail.com",
            pass: "lsvqdizarolouqrn",
          },
        });
        const mailOptions = {
          from: "nguyenanh160201@gmail.com",
          to: userData.email,
          subject: `Quản lý nhà trọ HomeLight`,
          html: `<h3>Quản lý nhà trọ HomeLight kính chào Anh/Chị: ${userData.userName}</h3>
                  <p>Anh/Chị vừa kích hoạt tài khoản thành công trên HomeLight. 
                  Để sử dụng quý khách vui lòng truy cập đường dẫn sau: <a href="http://localhost:3001/login">Click vào đây</a></p>
                  <p>Tên đăng nhập: ${userData.email} </p>
                  <p>Mật khẩu: ${userData.password}</p>
                  <p>Mọi thắc mắc và góp ý, xin Anh/Chị vui lòng liên hệ với chúng tôi qua:</p>
                  <p> Email hỗ trợ: info@maple.com.vn </p>
                  <p> Điện thoại: 0915 85 0918</p>
                  <p>HomeLight trân trọng cảm ơn và rất hân hạnh được phục vụ Anh/Chị.</p>`,
        };
        const info = await transporter.sendMail(mailOptions);
      }
      return res.json({ message: result, status: "success" });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user and order.", status: "fail" });
  }
};

//

exports.createUserAccountAndUpdateRoom = async (req, res) => {
  const {
    userName,
    identification,
    phone,
    address,
    email,

    numberPlate,
    sex,
    birthday,
    securityDeposit,
    status,
    isUser,
    file,
  } = req.body;
  let start = req.body.start;
  let end = req.body.end;
  // start = start == null ? null : dateTime(start);
  // end = end == null ? null : dateTime(end);
  const password = setPassword();
  end = end === "" ? null : end;
  start = start === "" ? null : start;
  try {
    fs.readdir(uploadDir, async (err, files) => {
      if (err) {
        console.error("Error reading upload directory:", err);
        return;
      }
      let newestFiles = [];
      if (files[0] != "") {
        //sort the file list by time (using mtime)
        // sort in descending order-
        files.sort((file1, file2) => {
          const stat1 = fs.statSync(path.join(uploadDir, file1));
          const stat2 = fs.statSync(path.join(uploadDir, file2));
          return stat2.mtime - stat1.mtime;
        });

        // Retrieve the two most recent files.
        newestFiles = files.slice(0, 2);
      } else {
        newestFiles = [...file];
      }
      const userData = {
        userName: userName,
        identification: identification,
        imagePrevious: newestFiles[0],
        imageAfter: newestFiles[1],
        phone: phone,
        address: address,
        email: email,
        start: start,
        end: end,
        numberPlate: numberPlate,
        sex: sex,
        birthday: birthday,
        securityDeposit: securityDeposit,
        status: status,
        isUser: isUser,
        roomId: req.params.id,
        password: password,
        landlordId: req.user.userId,
      };
      const result = await createUserAccountAndUpdateRoom(userData);
      if (result.status == "success") {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "nguyenanh160201@gmail.com",
            pass: "lsvqdizarolouqrn",
          },
        });
        const mailOptions = {
          from: "nguyenanh160201@gmail.com",
          to: userData.email,
          subject: `Quản lý nhà trọ HomeLight`,
          html: `<h3>Quản lý nhà trọ HomeLight kính chào Anh/Chị: ${userData.userName}</h3>
                  <p>Anh/Chị vừa kích hoạt tài khoản thành công trên HomeLight. 
                  Để sử dụng quý khách vui lòng truy cập đường dẫn sau: <a href="http://localhost:3001/login">Click vào đây</a></p>
                  <p>Tên đăng nhập: ${userData.email} </p>
                  <p>Mật khẩu: ${userData.password}</p>
                  <p>Mọi thắc mắc và góp ý, xin Anh/Chị vui lòng liên hệ với chúng tôi qua:</p>
                  <p> Email hỗ trợ: info@maple.com.vn </p>
                  <p> Điện thoại: 0915 85 0918</p>
                  <p>HomeLight trân trọng cảm ơn và rất hân hạnh được phục vụ Anh/Chị.</p>`,
        };
        const info = await transporter.sendMail(mailOptions);
      }
      if (result.status == "success")
        return res.json({ message: result, status: "success" });
      else {
        return res.json({ message: result, status: "fail" });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user and order.", status: "fail" });
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const users = await Users.findAll({
      include: [
        {
          model: Accounts,
        },
      ],
    });
    const documents = JSON.parse(JSON.stringify(users)); //** gán thêm thuộc tính  */
    for (let i in documents) {
      documents[i].isActive = documents[i].Account.isActive;
    }

    res.json({ message: documents, status: "success" });
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
exports.findAllTenant = async (req, res, next) => {
  try {
    // lấy đc danh sách khách trọ của 1 người chủ
    const users = await LandlordTenant.findAll({
      where: {
        landlordId: req.user.userId,
      },
    });
    console.log(users);
    let i = 0;
    // từ danh sách .user lặp từng người tìm trong user_room để tra ra nhà trọ họ đang ở

    const documents = JSON.parse(JSON.stringify(users)); //** gán thêm thuộc tính  */
    for (let i in documents) {
      const user = await Users.findOne({
        where: { _id: documents[i].tenantId },
      });

      const user_room = await User_Room.findOne({
        where: {
          UserId: user._id,
        }, // lấy ra đc room
      });
      console.log("???user_room:", user_room);
      const room = await Rooms.findOne({
        where: {
          _id: user_room.RoomId,
        }, // lấy đc boarding
      });
      const item = JSON.parse(JSON.stringify(user));
      item.boardingId = room.boardingId;
      documents[i].user = item;
    }

    console.log("/////", documents[0].user.boardingId);
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "fail" });
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const document = await Users.findOne({
      where: { _id: req.params.id },
    });

    res.json({ message: document, status: "success" });
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
exports.getImg = async function (req, res) {
  const imagePath = path.join(
    __dirname,
    "..",
    "..",
    "/uploads/images",
    `${req.params.id}`
  );
  res.sendFile(imagePath);
};
exports.delete = async (req, res, next) => {
  try {
    const documents = await Users.destroy({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
exports.deleteOne = async (req, res, next) => {
  try {
    const img = await Users.findOne({
      where: { _id: req.params.id },
    });
    const array = ["imagePrevious", "imageAfter"];
    for (let value of array) {
      let filePath = `${uploadDir}/${img.dataValues[value]}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); //delete file
      }
    }

    const document = await Users.destroy({
      where: { _id: req.params.id },
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
exports.update = async (req, res, next) => {
  let {
    userName,
    identification,
    phone,
    address,
    email,
    numberPlate,
    sex,
    birthday,
    securityDeposit,
    removeImages,
    countFile,
  } = req.body;
  try {
    if (removeImages.length > 0) removeImages.pop();

    const user = await Users.findOne({ where: { _id: req.params.id } });

    if (removeImages.length > 0) {
      for (let image of removeImages) {
        let img = JSON.parse(image);
        let filePath = `${uploadDir}/${img.id}`;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); //delete file
        }
      }
    }
    const document = await Users.update(
      {
        userName: userName,
        identification: identification,
        // imagePrevious: newestFiles[0],
        // imageAfter: newestFiles[1],
        phone: phone,
        address: address,
        email: email,
        numberPlate: numberPlate,
        sex: sex,
        birthday: birthday,
      },
      {
        where: {
          _id: req.params.id,
        },
      }
    );
    if (countFile > 0) {
      fs.readdir(uploadDir, async (error, files) => {
        if (error) {
          console.error("Error reading upload directory:", error);
          return;
        }
        let newestFiles = [];

        //sort the file list by time (using mtime)
        // sort in descending order-
        files.sort((file1, file2) => {
          const stat1 = fs.statSync(path.join(uploadDir, file1));
          const stat2 = fs.statSync(path.join(uploadDir, file2));
          return stat2.mtime - stat1.mtime;
        });

        // Retrieve the two most recent files.
        if (countFile == 2) {
          newestFiles = files.slice(0, 2);

          const document = await Users.update(
            {
              imagePrevious: newestFiles[0],
              imageAfter: newestFiles[1],
            },
            {
              where: {
                _id: req.params.id,
              },
            }
          );
        } else if (countFile == 1) {
          let img = JSON.parse(removeImages[0]);
          newestFiles = files.slice(0, 1);
          let data = {};
          data[img.name] = newestFiles[0];
          const document = await Users.update(
            data,

            {
              where: {
                _id: req.params.id,
              },
            }
          );
        }
      });
    }

    res.json({ message: document, status: "success" });
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};

// exports.create = async (req, res, next) => {
//   let { userName, identification, phone, address, email, start, end, file } =
//     req.body;
//   console.log("Body:", req.body);
//   end = end === "" ? null : end;
//   start = start === "" ? null : start;
//   try {
//     // Access the 'uploads' directory directly and retrieve the name of the saved file.
//     fs.readdir(uploadDir, async (err, files) => {
//       if (err) {
//         console.error("Error reading upload directory:", err);
//         return;
//       }
//       let newestFiles = [];
//       console.log("files[0]", files[0] == "");
//       if (files[0] != "") {
//         //sort the file list by time (using mtime)
//         // sort in descending order-
//         files.sort((file1, file2) => {
//           const stat1 = fs.statSync(path.join(uploadDir, file1));
//           const stat2 = fs.statSync(path.join(uploadDir, file2));
//           return stat2.mtime - stat1.mtime;
//         });

//         // Retrieve the two most recent files.
//         newestFiles = files.slice(0, 2);
//       } else {
//         newestFiles = [...file];
//       }
//       console.log("New:", newestFiles);
//       const documents = await Users.create({
//         userName: userName,
//         identification: identification,
//         imagePrevious: newestFiles[0],
//         imageAfter: newestFiles[1],
//         phone: phone,
//         address: address,
//         email: email,
//         start: start,
//         end: end,
//       });
//       res.json({ message: documents, status: "success" });
//     });
//   } catch (error) {
//     res.json({ message: error, status: "fail" });
//   }
// };
