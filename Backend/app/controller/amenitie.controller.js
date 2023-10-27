const { Amenities, Amenitie_Room } = require("../models/index.model.js");
exports.create = async (req, res, next) => {
  const { name } = req.body;

  try {
    const document = await Amenities.create({
      name: name,
      userId: req.user ? req.user.userId : "",
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.createAmenitiesRoom = async (req, res, next) => {
  console.log("AmenityId:", req.body, req.params.id);
  try {
    const document = await Amenitie_Room.create({
      RoomId: req.params.id,
      AmenityId: req.body.AmenityId,
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const amenitis = await Amenities.findAll({});
    let documents = JSON.parse(JSON.stringify(amenitis));
    documents = documents.filter(
      (item) => item.userId == "" || item.userId == req.user.userId
    );

    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
// exports.findAllUser = async (req, res, next) => {
//   try {
//     const documents = await Amenities.findAll({
//       where: {
//         userId: req.user.userId || "",
//       },
//     });
//     res.json({ message: documents, status: "success" });
//   } catch (error) {
//     console.log(error);
//     res.json({ message: error, status: "faild" });
//   }
// };
exports.findOne = async (req, res, next) => {
  try {
    const document = await Amenities.findAll({
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
  const { name } = req.body;
  console.log("Amenities Body:", req.body);
  try {
    const document = await Amenities.update(
      {
        name: name,
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
    const document = await Amenitie_Room.destroy({
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
exports.deleteAll = async (req, res, next) => {
  try {
    const documents = await Amenities.destroy({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
