const { BorardingHouse } = require("../models/index.model.js");
const { deleteBoardingAndRooms } = require("../models/transaction.service");
exports.create = async (req, res, next) => {
  const { name, address, phone } = req.body;
  try {
    const document = await BorardingHouse.create({
      name: name,
      address: address,
      phone: phone,
      userId: req.user.userId,
      isDelete: false,
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const documents = await BorardingHouse.findAll({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findAllUser = async (req, res, next) => {
  try {
    const boardings = await BorardingHouse.findAll({
      where: { userId: req.user.userId, isDelete: false },
    });
    let documents = JSON.parse(JSON.stringify(boardings));
    documents = documents.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const document = await BorardingHouse.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    return res.json({ message: error, status: "faild" });
  }
};
exports.updated = async (req, res, next) => {
  const { name, address, phone, isDelete } = req.body;
  console.log("Update BorardingHouse", req.body);
  try {
    const document = await BorardingHouse.update(
      {
        name: name,
        address: address,
        phone: phone,
        userId: req.user.userId,
        isDelete: isDelete,
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
    // const document = await BorardingHouse.destroy({
    //   where: {
    //     _id: req.params.id,
    //   },
    // });
    const data = {
      _id: req.params.id,
    };
    const document = await deleteBoardingAndRooms(data);
    console.log(">>>doc:", document);
    return res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.deleteAll = async (req, res, next) => {
  try {
    const documents = await BorardingHouse.destroy({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
