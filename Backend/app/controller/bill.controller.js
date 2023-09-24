const {
  Bill,
  User_Room,
  Service_Room,
  Services,
  UtilityReadings,
  Rooms,
} = require("../models/index.model.js");
exports.create = async (req, res, next) => {
  const { debt, roomId } = req.body;
  let endDay = new Date();
  endDay = new Date(endDay.getFullYear(), endDay.getMonth() + 1, 1);
  endDay.setDate(endDay.getDate() - 1);
  let end = req.body.end ? req.body.end : endDay;
  try {
    const documentUserRoom = await User_Room.findAll({
      where: {
        RoomId: roomId,
      },
    });
    const uti = await UtilityReadings.findAll({
      where: {
        roomId: roomId,
      },
      order: [["createdAt", "DESC"]], // Sắp xếp giảm dần theo createdAt
      limit: 1, // Giới hạn để chỉ lấy bản ghi mới nhất
    });
    const documentUti = JSON.parse(JSON.stringify(uti));

    const documentServiceRoom = await Service_Room.findAll({
      where: {
        RoomId: roomId,
      },
    });
    let total = 0;
    for (let value of documentServiceRoom) {
      const documentService = await Services.findOne({
        where: { _id: value.ServiceId },
      });
      const Water = ["nước", "Nước"];
      const Elec = ["điện", "Điện"];
      // const price = Number(documentService.price);

      if (Water.includes(documentService.name)) {
        total =
          total +
          Number(documentService.price) *
            (Number(documentUti[0].currentWater) -
              Number(documentUti[0].previousWater));
      } else if (Elec.includes(documentService.name)) {
        total =
          total +
          Number(documentService.price) *
            (Number(documentUti[0].currentElectric) -
              Number(documentUti[0].previousElectric));
      } else total = total + Number(documentService.price);
    }
    const documentRoom = await Rooms.findOne({
      where: { _id: roomId },
    });
    total = total + Number(documentRoom.dataValues.price);
    console.log(">>>data:", end, total, roomId);
    const document = await Bill.create({
      end: end,
      total: total,
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

    debt,
    total,
    roomId,
  } = req.body;
  console.log("Bill Body:", req.body);
  try {
    const document = await Bill.update(
      {
        start: start,
        end: end,

        debt: debt,
        total: total,
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
