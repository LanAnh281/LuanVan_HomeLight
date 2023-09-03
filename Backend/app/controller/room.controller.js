const { Rooms } = require("../models/index.model.js");
exports.create = async (req, res, next) => {
  const { name, price, area, boardingId, cycleId } = req.body;
  let status = req.body.status;
  if (!req.body.status) status = false;
  else status = true;
  try {
    const document = await Rooms.create({
      name: name,
      price: price,
      area: area,
      status: status,
      boardingId: boardingId,
      cycleId: cycleId,
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const documents = await Rooms.findAll({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const document = await Rooms.findAll({
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
  const { name, price, area, status, boardingId, cycleId } = req.body;
  console.log("Update Rooms", req.body);
  try {
    const document = await Rooms.update(
      {
        name: name,
        price: price,
        area: area,
        status: status,
        boardingId: boardingId,
        cycleId: cycleId,
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
    const document = await Rooms.destroy({
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
    const documents = await Rooms.destroy({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
