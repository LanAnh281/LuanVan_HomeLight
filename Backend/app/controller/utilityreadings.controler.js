const { Bill, UtilityReadings } = require("../models/index.model.js");
exports.create = async (req, res, next) => {
  const {
    previousElectric,
    currentElectric,
    previousWater,
    currentWater,
    date,
    roomId,
  } = req.body;
  console.log("UtilityReadings Body:", req.body);
  try {
    const document = await UtilityReadings.create({
      previousElectric: previousElectric,
      currentElectric: currentElectric,
      previousWater: previousWater,
      currentWater: currentWater,
      date: date,
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
    const documents = await UtilityReadings.findAll({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findOne = async (req, res, next) => {
  try {
    console.log("??roomId", req.params.id);

    const documents = await UtilityReadings.findAll({
      where: {
        roomId: req.params.id,
      },
    });
    let document = JSON.parse(JSON.stringify(documents));
    document = document.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    console.log(">>>sắp xếp từ lớm đến bé", document);
    // console.log("!!", document);
    res.json({ message: document[0], status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "fail" });
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
