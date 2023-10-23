const {
  Bill,
  User_Room,
  Service_Room,
  Services,
  UtilityReadings,
  Rooms,
  Receipt,
  Notification,
  User_Notification,
} = require("../models/index.model.js");
exports.findAll = async (req, res, next) => {
  try {
    const documents = await Bill.findAll({
      include: [
        {
          model: Receipt,
        },
        {
          model: Rooms,
        },
      ],
    });
    return documents;
  } catch (error) {
    console.log(error);
    return { message: error, status: "fail" };
  }
};
exports.create = async () => {
  try {
    const documentRoom = await Rooms.findAll({
      where: {
        status: true,
      },
    });
    for (let room of documentRoom) {
      let total = 0;
      let services = "";
      // phòng
      const documentRoom = await Rooms.findOne({
        where: { _id: room._id },
      });
      total = total + Number(documentRoom.dataValues.price);
      services = `${services}Phòng - ${documentRoom.dataValues.price} ,`;
      // tìm chỉ số điện nước mới nhất của phòng
      const documentUti = await UtilityReadings.findAll({
        where: {
          roomId: room._id,
        },
        order: [["createdAt", "DESC"]], // Sắp xếp giảm dần theo createdAt
        limit: 1, // Giới hạn để chỉ lấy bản ghi mới nhất
      });

      // tìm các dịch vụ của phòng
      const documentServiceRoom = await Service_Room.findAll({
        where: {
          RoomId: room._id,
        },
      });
      // dùng id service-tìm giá dịch vụ
      // let total = 0;
      // let services = "";
      for (let value of documentServiceRoom) {
        const documentService = await Services.findOne({
          where: { _id: value.ServiceId },
        });
        services =
          services +
          `${documentService["name"]} - ${documentService["price"]} ,`;
        const Water = ["nước", "Nước"];
        const Elec = ["điện", "Điện"];

        if (Water.includes(documentService.name)) {
          const currentWater = documentUti[0]
            ? Number(documentUti[0].currentWater)
            : 0;
          const previousWater = documentUti[0]
            ? Number(documentUti[0].previousWater)
            : 0;
          total =
            total +
            Number(documentService.price) * (currentWater - previousWater);
        } else if (Elec.includes(documentService.name)) {
          // so sánh tồn tại và k tồn tại của các chỉ số
          const currentElectric = documentUti[0]
            ? Number(documentUti[0].currentElectric)
            : 0;
          const previousElectric = documentUti[0]
            ? Number(documentUti[0].previousElectric)
            : 0;

          total =
            total +
            Number(documentService.price) *
              (currentElectric - previousElectric);
        } else total = total + Number(documentService.price);
      }

      services = services.replace(/,$/, "");
      const now = new Date();
      const document = await Bill.create({
        end: now,
        total: total,
        debt: total,
        services: services,
        roomId: room._id,
      });
      // lưu thông báo
      const documentNoti = await Notification.create({
        date: now,
        content: `Thông báo hóa đơn ${now.getMonth() + 1}/${now.getFullYear()}`,
      });
      // console.log("Thông báo:", documentNoti);
      const documentUser_Room = await User_Room.findAll({
        where: { RoomId: room._id },
      });
      // console.log("user_room:", documentUser_Room);
      for (let user of documentUser_Room) {
        const documentUser_Noti = await User_Notification.create({
          UserId: user.UserId,
          NotificationId: documentNoti._id,
          isDelete: false,
        });
      }
    }

    return documentRoom;
  } catch (error) {
    return { message: error, status: "fail" };
  }
};
