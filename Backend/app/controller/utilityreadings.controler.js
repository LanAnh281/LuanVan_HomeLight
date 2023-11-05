const {
  Rooms,
  UtilityReadings,
  Users,
  BorardingHouse,
} = require("../models/index.model.js");
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
    // const user = await Users.findOne({
    //   where: {
    //     _id: req.user.userId,
    //   },
    // });
    // console.log("**Đang đăng nhập:", user);
    // const boarding = await BorardingHouse.findAll({
    //   where: {
    //     userId: user["_id"],
    //   },
    // });
    // console.log("Ds nhà trọ :", boarding);
    // for (let value in boarding) {
    //   console.log("Nhà trọ", value);
    // }
    const utis = await UtilityReadings.findAll({
      include: {
        model: Rooms,
      },
    });

    let documents = JSON.parse(JSON.stringify(utis));
    for (let i in documents) {
      documents[i].name = documents[i].Room.name;
      documents[i].roomId = documents[i].Room._id;
    }
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const documents = await UtilityReadings.findAll({
      where: {
        roomId: req.params.id,
      },
    });
    let document = JSON.parse(JSON.stringify(documents));
    document = document.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
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
