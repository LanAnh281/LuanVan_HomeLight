const { Bill } = require("../models/index.model.js");
exports.create = async (req, res, next) => {
  const {
    start,
    end,
    previousElectric,
    currentElectric,
    previousWater,
    currentWater,
    Debt,
    Total,
    roomId,
  } = req.body;
  console.log("Bill Body:", req.body);
  try {
    const document = await Bill.create({
      start: start,
      end: end,
      previousElectric: previousElectric,
      currentElectric: currentElectric,
      previousWater: previousWater,
      currentWater: currentWater,
      Debt: Debt,
      Total: Total,
      roomId: roomId,
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const documents = await Bill.findAll({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const document = await Bill.findAll({
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
  const {
    start,
    end,
    previousElectric,
    currentElectric,
    previousWater,
    currentWater,
    Debt,
    Total,
    roomId,
  } = req.body;
  console.log("Bill Body:", req.body);
  try {
    const document = await Bill.update(
      {
        start: start,
        end: end,
        previousElectric: previousElectric,
        currentElectric: currentElectric,
        previousWater: previousWater,
        currentWater: currentWater,
        Debt: Debt,
        Total: Total,
        roomId: roomId,
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
    const document = await Bill.destroy({
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
    const documents = await Bill.destroy({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
