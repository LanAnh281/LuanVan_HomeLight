const { Accounts, Positions } = require("../models/index.model.js");
const nodemailer = require("nodemailer");

const crypto = require("crypto");
const encryptionKey = "12345678912345678901234567890121";
const iv = "0123456789abcdef";
const setEncrypt = (value) => {
  const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);
  let encrypted = cipher.update(value, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};
const getDecrypt = (name) => {
  if (name) {
    const decipher = crypto.createDecipheriv("aes-256-cbc", encryptionKey, iv);
    let decrypted = decipher.update(name, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
};
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
exports.create = async (req, res, next) => {
  const { userName, userId, positionId } = req.body;
  const password = setEncrypt(setPassword());
  try {
    const document = await Accounts.create({
      userName: userName,
      password: password,
      isActive: 1,
      userId: userId,
      positionId: positionId,
    });
    if (document) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "nguyenanh160201@gmail.com",
          pass: "lsvqdizarolouqrn",
        },
      });
      const mailOptions = {
        from: "nguyenanh160201@gmail.com",
        to: userName,
        subject: `Quản lý nhà trọ HomeLight`,
        html: `<h3>Quản lý nhà trọ HomeLight kính chào:</h3>
        
                <p>Anh/Chị vừa kích hoạt tài khoản thành công trên HomeLight. 
                Để sử dụng quý khách vui lòng truy cập đường dẫn sau: <a href="http://localhost:3001/login">Click vào đây</a></p>
                <p>Tên đăng nhập: ${userName} </p>
                <p>Mật khẩu: ${getDecrypt(password)}</p>
                <p>Mọi thắc mắc và góp ý, xin Anh/Chị vui lòng liên hệ với chúng tôi qua:</p>
                <p> Email hỗ trợ: info@maple.com.vn </p>
                <p> Điện thoại: 0915 85 0918</p>
                <p>HomeLight trân trọng cảm ơn và rất hân hạnh được phục vụ Anh/Chị.</p>`,
      };
      const info = await transporter.sendMail(mailOptions);
    }
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const accounts = await Accounts.findAll({
      include: {
        model: Positions,
      },
    });
    const documents = JSON.parse(JSON.stringify(accounts));
    for (let i = 0; i < documents.length; i++) {
      documents[i].positionName = documents[i].Position["name"];
    }
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const document = await Accounts.findAll({
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
  const _id = req.user._id;
  let { userName, passwordOld, password, userId, positionId, isActive } =
    req.body;
  try {
    const account = await Accounts.findOne({ where: { _id: _id } });
    if (account && getDecrypt(account["password"]) === passwordOld) {
      password = setEncrypt(password);
      const document = await Accounts.update(
        {
          userName: userName,
          password: password,
          isActive: isActive,
          userId: userId,
          positionId: positionId,
        },
        {
          where: {
            _id: _id,
          },
        }
      );
      res.json({ message: document, status: "success" });
    } else {
      res.json({ message: "fail", status: "fail" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error, status: "faild" });
  }
};
exports.updatedActive = async (req, res, next) => {
  let { isActive } = req.body;
  try {
    const document = await Accounts.update(
      {
        isActive: isActive,
      },
      {
        where: { _id: req.params.id },
      }
    );
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error, status: "faild" });
  }
};
exports.delete = async (req, res, next) => {
  try {
    const document = await Accounts.destroy({
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
    const documents = await Accounts.destroy({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
