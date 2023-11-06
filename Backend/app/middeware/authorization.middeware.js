const { Roles, Roles_Positions } = require("../models/index.model");
const jwt = require("jsonwebtoken");
const secret = "asdfghjkl!@#";

// Middleware xác thực
exports.authentication = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    if (!token) {
      return res
        .status(401)
        .json({ message: "Token not provided", status: "fail" });
    }
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Invalid token", status: "fail" });
      }
      req.user = decoded;

      next();
    });
  } catch (error) {
    return res.json({ message: error, status: "fail" });
  }
};

// Middleware xác định quyền
exports.authorization = (requiredPermission) => {
  return async (req, res, next) => {
    const { user } = req;
    if (!user) {
      return res.status(403).json({ message: "Access denied" });
    }
    const role_position = await findByRoleName(
      user.position["_id"],
      requiredPermission
    );
    if (!role_position) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
const findByRoleName = async (position, name) => {
  try {
    const document = await Roles.findAll({ where: { name: name } });
    if (!document) return res.status(403).json({ message: "Access denied" });
    for (let value of document) {
      const role_position = await Roles_Positions.findOne({
        where: {
          positionId: position,
          RoleId: value["_id"],
        },
      });
      if (role_position) return role_position;
    }

    return [];
  } catch (error) {
    return res.json({ message: "Access denied", status: "fail" });
  }
};
