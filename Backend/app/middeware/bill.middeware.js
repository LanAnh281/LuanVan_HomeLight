const { sequelize } = require("../config/index");
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
  Positions,
  Accounts,
  Bill_User,
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
    const now = new Date();

    const documentRoom = await Rooms.findAll({
      where: {
        status: true,
      },
    });
    // lưu thông báo
    const documentNoti = await Notification.create({
      date: now,
      content: `Thông báo hóa đơn ${now.getMonth() + 1}/${now.getFullYear()}`,
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

      const document = await Bill.create({
        end: now,
        total: total,
        debt: total,
        services: services,
        roomId: room._id,
      });
      // tạo phiếu thu kèm theo hóa đơn
      const documentReceipt = await Receipt.create({
        receive: 0,
        debt: total,
        billId: document._id,
        content: "",
      });
      // // lưu thông báo
      // const documentNoti = await Notification.create({
      //   date: now,
      //   content: `Thông báo hóa đơn ${now.getMonth() + 1}/${now.getFullYear()}`,
      // });
      const documentUser_Room = await User_Room.findAll({
        where: { RoomId: room._id },
      });
      for (let user of documentUser_Room) {
        const documentUser_Noti = await User_Notification.create({
          UserId: user.UserId,
          NotificationId: documentNoti._id,
          isDelete: false,
          isRead: false,
        });
      }
    }

    return documentRoom;
  } catch (error) {
    return { message: error, status: "fail" };
  }
};

exports.createBill_user = async () => {
  try {
    const now = new Date();
    const documentPosition = await Positions.findOne({
      where: { name: "super-admin" },
    });
    const documentSuperAdmin = await Accounts.findOne({
      where: { positionId: documentPosition["_id"] },
    });
    // lấy dịch vụ của super admin
    // dạng ds
    const documentService = await Services.findAll({
      where: { userId: documentSuperAdmin["userId"] },
    });
    // tổng số phòng của từng chủ trọ
    const totalRoom = await sequelize.query(
      `
        SELECT Users._id, COUNT(Rooms._id) as totalRooms
        FROM Users
        LEFT JOIN boardinghouses ON Users._id = boardinghouses.userId
        LEFT JOIN Rooms ON boardinghouses._id = Rooms.boardingId
        where Users.isUser=true
        GROUP BY Users._id
  `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    // tạo thông báo mơi
    const documentNoti = await Notification.create({
      date: now,
      content: `Thông báo hóa đơn quản lý nhà trọ ${
        now.getMonth() + 1
      }/${now.getFullYear()}`,
    });

    for (let value of totalRoom) {
      let price = 0;
      let content = "";
      for (let val of documentService) {
        // tính tiền
        price = Number(price) + Number(val.price) * value.totalRooms;
        content += `${val.name} - ${val.price} - ${val.unit} - ${documentSuperAdmin["userId"]},`;
      }
      // tạo hóa đơn,
      content = content.replace(/,$/, "");
      const documentBillUser = await Bill_User.create({
        userId: value._id,
        content: content,
        total: price,
      });
      // tạo phiếu thu kèm theo hóa đơn
      const documentReceipt = await Receipt.create({
        receive: 0,
        debt: price,
        billUserId: documentBillUser._id,
        content: "",
      });
      // truyển thông báo đi
      const documentNotiUser = await User_Notification.create({
        UserId: value._id,
        NotificationId: documentNoti._id,
        isDelete: false,
        isRead: false,
      });
    }

    return "lập bill chủ trọ";
  } catch (error) {
    return { message: error, status: "fail" };
  }
};

/*
Dựa vào id user với vai trò là super-admin lấy là đc dịch vụ và tính tiền
dựa vào userId của chủ trọ đếm số phòng đã đăng ký ở websitr
-dùng giá dịch vụ* số phòng= tiền cần thanh toán
-Thêm thông báo cho việc trả tiền thuê website 
    Thêm thông báo mới
    Người tạo là hệ thống, người nhận là user chủ trọ
- Thanh toán bên chủ trọ sẽ nằm ở mục header, thanh toán paypal
- cập nhật lại phiếu thanh toán và lịch sử thanh toán (receipt sẽ dựa vảo createdAt để biết thanh toán lúc nào).

*/
