const { Bill, UtilityReadings } = require("../models/index.model.js");
exports.create = async (req, res, next) => {
  const {
    previousElectric,
    currentElectric,
    previousWater,
    currentWater,
    date,
  } = req.body;
  console.log("UtilityReadings Body:", req.body);
  try {
    const document = await UtilityReadings.create({
      previousElectric: previousElectric,
      currentElectric: currentElectric,
      previousWater: previousWater,
      currentWater: currentWater,
      date: date,
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const documents = await UtilityReadings.findAll({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const document = await UtilityReadings.findAll({
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
    previousElectric,
    currentElectric,
    previousWater,
    currentWater,
    date,
  } = req.body;
  console.log("UtilityReadings Body:", req.body);
  try {
    const document = await UtilityReadings.update(
      {
        previousElectric: previousElectric,
        currentElectric: currentElectric,
        previousWater: previousWater,
        currentWater: currentWater,
        date: date,
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
    const document = await UtilityReadings.destroy({
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
    const documents = await UtilityReadings.destroy({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
