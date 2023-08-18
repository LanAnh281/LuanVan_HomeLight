const { Count } = require("../models/index.model.js");
exports.create = async (req, res, next) => {
  const { count, equipmentId, roomId } = req.body;
  console.log("Count Body:", req.body);
  try {
    const document = await Count.create({
      count: count,
      EquipmentId: equipmentId,
      RoomId: roomId,
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const documents = await Count.findAll({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const document = await Count.findAll({
      where: {
        RoomId: req.params.id,
      },
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.updated = async (req, res, next) => {
  const { count, equipmentId, roomId } = req.body;
  console.log("Count Body:", req.body);
  try {
    const document = await Count.update(
      {
        count: count,
        EquipmentId: equipmentId,
        RoomId: roomId,
      },
      {
        where: {
          EquipmentId: equipmentId,
          RoomId: roomId,
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
  const { equipmentId, roomId } = req.body;
  try {
    const document = await Count.destroy({
      where: {
        EquipmentId: equipmentId,
        RoomId: roomId,
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
    const documents = await Count.destroy({
      where: {
        RoomId: req.params.id,
      },
    });
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
