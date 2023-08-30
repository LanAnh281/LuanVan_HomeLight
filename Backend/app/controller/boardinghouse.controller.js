const { BorardingHouse } = require("../models/index.model.js");

const role = ["super-admin", "admin"];

exports.create = async (req, res, next) => {
  const { name, address, rules } = req.body;
  try {
    if (role.includes(req.position.name)) {
      const document = await BorardingHouse.create({
        name: name,
        address: address,
        rules: rules,
        userId: req.userId,
      });
      return res.json({ message: document, status: "success" });
    }
    return res.json({ message: "fail", status: "fail" });
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
    if (role.includes(req.position.name)) {
      const document = await BorardingHouse.destroy({
        where: {
          _id: req.params.id,
        },
      });
      return res.json({ message: document, status: "success" });
    } else {
      return res.json({ message: "fail", status: "fail" });
    }
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
