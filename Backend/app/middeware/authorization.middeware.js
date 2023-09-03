const { Roles, Roles_Positions } = require("../models/index.model");
const jwt = require("jsonwebtoken");
const secret = "asdfghjkl!@#";
// exports.authorization = (req, res, next) => {
//   try {
//     const auth = req.headers.authorization;
//     console.log("req.headers.authorization", req.headers.authorization);
//     if (auth) {
//       jwt.verify(req.headers.authorization, secret, function (err, decoded) {
//         if (err) {
//           // Xử lý lỗi nếu JWT không hợp lệ
//           console.log("error at auth middeware", err);
//           return res.status(401).send({ message: "Invalid token" });
//         }
//         // JWT hợp lệ, "decoded" chứa thông tin giải mã từ payload của JWT
//         req._id = decoded._id;
//         req.position = decoded.position;
//         req.userId = decoded.userId;
//         next();
//       });
//     } else {
//       req._id = null;
//       req.position = null;
//       req.userId = null;
//       next();
//     }
//   } catch (error) {
//     res.json({ message: error, status: "fail" });
//   }
// };

// Middleware xác thực
exports.authentication = (req, res, next) => {
  const token = req.headers.authorization;
  console.log("token:", token);
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
    console.log("user", user);
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
    const document = await Roles.findOne({ where: { name: name } });
    if (!document) return res.status(403).json({ message: "Access denied" });
    const role_position = await Roles_Positions.findOne({
      where: {
        positionId: position,
        RoleId: document["_id"],
      },
    });
    return role_position;
  } catch (error) {
    return res.json({ message: "Access denied", status: "fail" });
  }
};
