const { User_Room, Rooms, Users } = require("../models/index.model.js");
const { dateTime } = require("../middeware/datetime.middeware");
exports.create = async (req, res, next) => {
  let { start, end, userId, roomId } = req.body;
  console.log("User_Room Body:", req.body);
  start = dateTime(start);
  end = end == null ? null : dateTime(end);
  try {
    const document = await User_Room.create({
      start: start,
      end: end,
      UserId: userId,
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
    const documents = await Rooms.findAll({
      include: {
        model: Users,
        through: { attributes: [] },
      },
    });
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findOne = async (req, res, next) => {
  try {
    console.log(">>>id:", req.params.id);
    const documents = await Rooms.findAll({
      where: {
        _id: req.params.id,
      },
      include: [
        {
          model: Users,
          through: {
            attributes: [], // Bỏ qua thuộc tính của bảng trung gian (nếu bạn không muốn chúng)
          },
        },
      ],
    });
    // console.log(">>>doc:", documents.dataValue["Users"]);
    // // Làm phẳng dữ liệu
    // const flattenedData = documents["Users"].map((user) => {
    //   const flatUser = { ...user };
    //   for (const key in documents) {
    //     if (key !== "Users") {
    //       flatUser[key] = data[key];
    //     }
    //   }
    //   return flatUser;
    // });

    // Kết quả là một mảng chứa các người dùng đã được mở rộng với thông tin từ cấp bằng
    // console.log(flattenedData);

    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.updated = async (req, res, next) => {
  let { start, end, userId, roomId } = req.body;
  console.log("User_Room Body:", req.body);
  start = dateTime(start);
  end = end == null ? null : dateTime(end);

  try {
    const document = await User_Room.update(
      {
        start: start,
        end: end,
        UserId: userId,
        RoomId: roomId,
      },
      {
        where: {
          UserId: userId,
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
  const { userId, roomId } = req.body;

  try {
    const document = await User_Room.destroy({
      where: {
        UserId: userId,
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
    const documents = await User_Room.destroy({
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
