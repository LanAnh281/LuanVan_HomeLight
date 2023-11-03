const { Spending, BorardingHouse } = require("../models/index.model.js");
const { dateTime } = require("../middeware/datetime.middeware");
exports.create = async (req, res, next) => {
  let { date, reason, price, isProfit, boardingId } = req.body;
  date = date == null ? null : dateTime(date);
  try {
    const document = await Spending.create({
      date: date,
      reason: reason,
      price: price,
      isProfit: isProfit,
      boardingId: boardingId,
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const spendings = await Spending.findAll({
      include: [{ model: BorardingHouse }],
    });
    let documents = JSON.parse(JSON.stringify(spendings));
    documents = documents.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const document = await Spending.findOne({
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
  let { date, reason, price, isProfit, boardingId } = req.body;
  date = date == null ? null : dateTime(date);

  console.log("Spending Body:", req.body);
  try {
    const document = await Spending.update(
      {
        date: date,
        reason: reason,
        price: price,
        isProfit: isProfit,
        boardingId: boardingId,
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
    const document = await Spending.destroy({
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
    const documents = await Spending.destroy({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
