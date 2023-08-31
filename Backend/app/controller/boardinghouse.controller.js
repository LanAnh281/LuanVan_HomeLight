const { BorardingHouse } = require("../models/index.model.js");

exports.create = async (req, res, next) => {
  const { name, address } = req.body;
  console.log(">>>Body:", req.body);
  try {
    const document = await BorardingHouse.create({
      name: name,
      address: address,
      userId: req.user.userId,
    });
    console.log(">>>DOC:", document);
    return res.status(200).json({ message: document, status: "success" });
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
exports.findOne = async (req, res, next) => {
  try {
    const document = await BorardingHouse.findOne({
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
  const { name, address, rules, userId } = req.body;
  console.log("Update BorardingHouse", req.body);
  try {
    const document = await BorardingHouse.update(
      {
        name: name,
        address: address,
        rules: rules,
        userId: userId,
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
    const document = await BorardingHouse.destroy({
      where: {
        _id: req.params.id,
      },
    });
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
