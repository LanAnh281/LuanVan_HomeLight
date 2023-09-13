const { User_Room, Rooms, Users } = require("../models/index.model.js");
const { dateTime } = require("../middeware/datetime.middeware");
exports.create = async (req, res, next) => {
  let { start, end, UserId, RoomId } = req.body;
  console.log("User_Room Body:", req.body);
  start = dateTime(start);
  end = end == null ? null : dateTime(end);
  try {
    const document = await User_Room.create({
      start: start,
      end: end,
      RoomId: RoomId,
      UserId: UserId,
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const documents = await User_Room.findAll({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findAllRoom = async (req, res, next) => {
  try {
    const documents = await User_Room.findAll({
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
exports.findOne = async (req, res, next) => {
  try {
    const documents = await Rooms.findOne({
      where: {
        _id: req.params.id,
      },
      include: [
        {
          model: Users,
          // through: {
          //   attributes: [], // Bỏ qua thuộc tính của bảng trung gian (nếu bạn không muốn chúng)
          // },
        },
      ],
    });

    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.updated = async (req, res, next) => {
  let { end, UserId, RoomId } = req.body;
  console.log(">>>User_Room Body:", req.body);

  end = end == null ? null : dateTime(end);

  try {
    const document = await User_Room.update(
      {
        end: end,
        UserId: UserId,
        RoomId: RoomId,
      },
      {
        where: {
          UserId: UserId,
          RoomId: RoomId,
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
  const { UserId, RoomId } = req.body;

  try {
    const document = await User_Room.destroy({
      where: {
        UserId: UserId,
        RoomId: RoomId,
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
