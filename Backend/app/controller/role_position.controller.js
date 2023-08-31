const { Roles_Positions } = require("../models/index.model.js");
exports.create = async (req, res, next) => {
  const { RoleId, PositionId } = req.body;
  console.log("Roles_Positions Body:", req.body);
  try {
    const document = await Roles_Positions.create({
      RoleId: RoleId,
      PositionId: PositionId,
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const document = await Roles_Positions.findAll({});
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
//findone a position
exports.findOne = async (req, res, next) => {
  try {
    const document = await Roles_Positions.findOne({
      where: {
        PositionId: req.params.id,
      },
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.updated = async (req, res, next) => {
  const { RoleId } = req.body;
  console.log("Update Roles_Positions", req.body);
  try {
    const document = await Roles_Positions.update(
      {
        RoleId: RoleId,
      },
      {
        where: {
          PositionId: req.params.id,
        },
      }
    );
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.deleteOne = async (req, res, next) => {
  const { RoleId, PositionId } = req.body;
  try {
    const document = await Roles_Positions.destroy({
      where: {
        RoleId: RoleId,
        PositionId: PositionId,
      },
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
