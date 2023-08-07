const { Account } = require("../models/index.model.js");
exports.create = async (req, res, next) => {
  const { userName, password, role } = req.body;
  console.log(userName, password, role);
  try {
    const document = await Account.create({
      userName: userName,
      password: password,
      role: role,
    });
    res.send({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.send({ message: error, status: "faild" });
  }
};
