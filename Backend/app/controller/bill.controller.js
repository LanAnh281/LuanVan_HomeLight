const {
  Bill,
  User_Room,
  Service_Room,
  Services,
  UtilityReadings,
  Rooms,
  Receipt,
  BorardingHouse,
  Users,
  PAYMENTHISTORY,
  Amenities,
} = require("../models/index.model.js");
const QRCode = require("qrcode");

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
    let services = "";
    for (let value of documentServiceRoom) {
      const documentService = await Services.findOne({
        where: { _id: value.ServiceId },
      });
      services =
        services + `${documentService["name"]} - ${documentService["price"]} ,`;
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
    services = `Phòng - ${documentRoom.dataValues.price}`;
    const document = await Bill.create({
      end: end,
      total: total,
      services: services,
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
    const documents = await Bill.findAll({
      include: [
        {
          model: Receipt,
        },
        {
          model: Rooms,
          include: [{ model: BorardingHouse }],
        },
      ],
    });
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findAllCustomer = async (req, res, next) => {
  try {
    // danh sách khách của 1 bill
    //  const documents = await Bill.findAll({
    //   include: [
    //     {
    //       model: Rooms,
    //       include: [
    //         {
    //           model: Users,
    //           through: {
    //             attributes: [], // Bỏ qua thuộc tính của bảng trung gian (nếu bạn không muốn chúng)
    //           },
    //         },
    //       ],
    //     },
    //   ],
    // });
    //? danh sách bill của 1 khách
    const bills = await Users.findOne({
      where: {
        _id: req.user.userId,
      },
      include: [
        {
          model: Rooms,
          through: {
            attributes: [], // Bỏ qua thuộc tính của bảng trung gian (nếu bạn không muốn chúng)
          },

          include: [{ model: Bill }, { model: Amenities }],
        },
      ],
    });
    const uti = await UtilityReadings.findAll({
      where: {
        roomId: bills.Rooms[0]._id,
      },
      order: [["createdAt", "DESC"]], // Sắp xếp giảm dần theo createdAt
      limit: 1, // Giới hạn để chỉ lấy bản ghi mới nhất
    });
    const boarding = await BorardingHouse.findOne({
      whereL: {
        _id: bills.Rooms[0].boardingId,
      },
      include: {
        model: Users,
      },
    });
    const documents = JSON.parse(JSON.stringify(bills));
    const phoneNumber = boarding.User.phone; // Thay thế bằng số điện thoại thực tế

    QRCode.toDataURL(`tel:${phoneNumber}`, (err, url) => {
      if (err) {
        console.error(err);
        return;
      }

      // Ở đây, bạn có thể gửi URL của mã QR về phía frontend hoặc lưu nó trong cơ sở dữ liệu để sử dụng sau này.

      documents.Rooms[0].UtilityReadings = uti;
      documents.Rooms[0].BoardingHouse = boarding;
      documents.Rooms[0].qrCodeUrl = url;
      res.json({ message: documents, status: "success" });
    });
    // const documents = JSON.parse(JSON.stringify(bills));

    // res.json({ message: documents, status: "success" });
  } catch (error) {
    res.json({ message: error, status: "faild" });
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const document = await Bill.findOne({
      include: [
        {
          model: Receipt,
        },
        {
          model: Rooms,
          include: [
            {
              model: UtilityReadings,
              order: [["createdAt", "DESC"]], // Sắp xếp giảm dần theo createdAt
              limit: 1, // Giới hạn để chỉ lấy bản ghi mới nhất
            },
          ],
        },
        {
          model: PAYMENTHISTORY,
        },
      ],
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
    // start,
    // end,

    debt,
    // total,
    // roomId,
  } = req.body;
  console.log("Bill Body:", req.body);
  try {
    const document = await Bill.update(
      {
        // start: start,
        // end: end,

        debt: debt,
        // total: total,
        // roomId: roomId,
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
