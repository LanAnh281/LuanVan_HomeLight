const { Bill_User, Receipt } = require("../models/index.model.js");

exports.findAll = async (req, res, next) => {
  try {
    const documents = await Bill_User.findAll({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "fail" });
  }
};
exports.findAllUser = async (req, res, next) => {
  try {
    const documents = await Bill_User.findAll({
      where: {
        userId: req.user.userId,
      },

      include: [{ model: Receipt }],
    });

    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "fail" });
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const document = await Bill_User.findAll({
      where: {
        _id: req.params.id,
      },
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "fail" });
  }
};
