const {
  Receipt,
  Bill,
  Rooms,
  PAYMENTHISTORY,
} = require("../models/index.model.js");
exports.create = async (req, res, next) => {
  const { receive, debt, billId, method } = req.body;
  console.log("Receipt Body:", req.body);
  try {
    const document = await Receipt.create({
      receive: receive,
      debt: debt,
      billId: billId,
    });
    // lịch sử thanh toán
    const documentPayHistory = await PAYMENTHISTORY.create({
      money: receive,
      method: method,
      billId: billId,
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const documents = await Receipt.findAll({
      include: [
        {
          model: Bill,
          include: [
            {
              model: Rooms,
            },
          ],
        },
      ],
    });
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const document = await Receipt.findOne({
      where: {
        billId: req.params.id,
      },
    });

    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.updated = async (req, res, next) => {
  const { receive, debt, billId, method } = req.body;
  console.log("Receipt Body:", req.body);
  try {
    const document = await Receipt.update(
      {
        receive: receive,
        debt: debt,
        billId: billId,
      },
      {
        where: {
          _id: req.params.id,
        },
      }
    );
    const documentPayHistory = await PAYMENTHISTORY.create({
      money: receive,
      method: method,
      billId: billId,
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.delete = async (req, res, next) => {
  try {
    const document = await Receipt.destroy({
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
    const documents = await Receipt.destroy({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
