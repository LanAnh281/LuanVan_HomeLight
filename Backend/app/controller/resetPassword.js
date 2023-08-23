const { ResetPassword, Users } = require("../models/index.model");
const moment = require("moment-timezone");
exports.create = async (req, res, next) => {
  const { email } = req.body;
  const resetPasswordExprityTime = moment().add(3, "minutes");
  console.log("Thời gian hết hạn:", resetPasswordExprityTime);
  try {
    const user = await Users.findOne({
      where: {
        email: email,
      },
    });
    console.log("user:", user);
    if (user) {
      const document = await ResetPassword.create({
        email: email,
        resetPasswordExprityTime: resetPasswordExprityTime,
      });
      res.json({ message: document, status: "success" });
    } else {
      res.json({ message: error, status: "fail" });
    }
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
exports.find = async (req, res, next) => {
  const { email, password } = req.body;
  const currentTime = moment();
  try {
    const document = await ResetPassword.findOne({
      where: {
        _id: req.param.id,
      },
    });

    if (document) {
      if (
        currentTime.isBefore(document["resetPasswordExprityTime"]) &&
        document["email"] == email
      )
        res.json({ message: document, status: "success" });
    } else {
      res.json({ message: error, status: "fail" });
    }
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
