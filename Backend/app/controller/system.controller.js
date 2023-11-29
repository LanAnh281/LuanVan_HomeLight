const {
  System,
  Users,
  Positions,
  Accounts,
} = require("../models/index.model.js");
const QRCode = require("qrcode");
exports.create = async (req, res, next) => {
  const { content, email, phone, service } = req.body;
  try {
    const document = await System.create({
      content: content,
      email: email,
      phone: phone,
      service: service,
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const documentPos = await Positions.findOne({
      where: { name: "super-admin" },
    });
    const documentAccount = await Accounts.findOne({
      where: { positionId: documentPos["_id"] },
    });
    const documentUser = await Users.findOne({
      where: { _id: documentAccount["userId"] },
    });
    console.log("Super-admin", documentUser);
    const documents = await System.findAll({});
    let document = JSON.parse(JSON.stringify(documents));
    const phoneNumber = document[0].phone; // Thay thế bằng số điện thoại thực tế
    QRCode.toDataURL(`tel:${phoneNumber}`, (err, url) => {
      if (err) {
        console.error(err);
        return;
      }
      document[0].qrCodeUrl = url;
      document[0].userId = documentUser._id;
      return res.json({ message: document, status: "success" });
    });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "fail" });
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const document = await System.findAll({
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
  const { content, email, phone, service } = req.body;
  try {
    const document = await System.update(
      {
        content: content,
        email: email,
        phone: phone,
        service: service,
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
    const document = await System.destroy({
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
    const documents = await System.destroy({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
